const pool = require('../db');
const multer = require('multer');
const fs = require('node:fs');

// Configuración de Multer para subir múltiples archivos
const upload = multer({ dest: 'upload/' });

// Función auxiliar para guardar el archivo con su nombre original y eliminar el temporal de multer
function saveFile(file) {
    // Construimos la ruta final en la carpeta 'upload' usando el nombre original
    const newPath = `./upload/${file.originalname}`;
    
    // Verificamos si la carpeta existe antes de renombrar
    if (!fs.existsSync('./upload')) {
        fs.mkdirSync('./upload');
    }

    // Renombramos el archivo temporal al nombre final (mueve el archivo)
    fs.renameSync(file.path, newPath);
    
    // Devolvemos la ruta relativa que se usará para construir la URL
    return newPath; 
}

// ===================================
//   OPERACIONES DE LECTURA (GET)
// ===================================

const getAllTema = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM tema WHERE estado = 'Habilitado'");
    
    // Convertimos contenido (JSON o string) a array de URLs completas
    const temas = result.rows.map(t => {
      let archivos = [];
      if (t.contenido) {
        try {
          // **Punto clave:** Asumimos que el contenido es un JSONB { archivos: ["url1", "url2"] }
          const parsedContent = typeof t.contenido === 'string' ? JSON.parse(t.contenido) : t.contenido;
          // Extraemos el array 'archivos' si existe
          archivos = parsedContent.archivos || [];

        } catch (e) {
            console.error("Error al parsear contenido del tema:", e);
            archivos = [];
        }
      }
      return { ...t, contenido: archivos }; // Devolvemos directamente el array de URLs completas
    });

    res.json(temas);
  } catch (error) {
    next(error);
  }
};


const getTema = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT * FROM tema WHERE id_tema = $1 AND estado = 'Habilitado'",
            [id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Tema no encontrado" });

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// ===============================
//   CREAR TEMA CON VARIOS ARCHIVOS
// ===============================
const createTema = async (req, res, next) => {
    const { titulo, descripcion, nombre_tutoria, nombre_institucion } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // (1) Verificar institución
        const instResult = await client.query(
            `SELECT id_institucion FROM institucion 
             WHERE nombre_institucion = $1 AND estado = 'Habilitado'`,
            [nombre_institucion]
        );

        if (instResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                message: `Institución "${nombre_institucion}" no encontrada o deshabilitada.`
            });
        }

        const id_institucion = instResult.rows[0].id_institucion;

        // (2) Verificar tutoría
        const tutoriaResult = await client.query(
            `SELECT id_tutoria FROM tutoria
             WHERE nombre_tutoria = $1 
             AND id_institucion = $2 
             AND estado = 'Habilitado'`,
            [nombre_tutoria, id_institucion]
        );

        if (tutoriaResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                message: `No se encontró una tutoría "${nombre_tutoria}" en la institución "${nombre_institucion}".`
            });
        }

        const id_tutoria = tutoriaResult.rows[0].id_tutoria;

        // (3) Verificar archivos (Multer ya los procesó y los puso en req.files)
        if (!req.files || req.files.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                error: "Debes enviar al menos un archivo en el campo 'archivos'"
            });
        }

        // (4) Guardar cada archivo y construir la URL
        const archivosUrl = req.files.map(file => {
            saveFile(file);
            // Usamos el puerto 4000
            return `http://localhost:4000/upload/${file.originalname}`;
        });

        // JSONB final que se guardará en la base de datos
        const contenido = {
            archivos: archivosUrl
        };

        // (5) Insertar nuevo tema
        const temaResult = await client.query(
            `INSERT INTO tema (titulo, contenido, descripcion, id_tutoria)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [titulo, contenido, descripcion, id_tutoria]
        );

        await client.query('COMMIT');

        res.status(201).json({
            message: "Tema creado correctamente con archivos adjuntos",
            data: temaResult.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error al crear tema:", error);
        next(error);
    } finally {
        client.release();
    }
};

// ==================================
//   UPDATE & DELETE (Update simple)
// ==================================
const deleteTema = async (req, res, next) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        await client.query('BEGIN');

        const result = await client.query(
            "UPDATE tema SET estado = 'Deshabilitado' WHERE id_tema = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Tema no encontrado" });
        }

        await client.query('COMMIT');

        res.status(200).json({ message: "Tema deshabilitado correctamente" });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

const updateTema = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion } = req.body; 
        
        let updateFields = 'titulo = $1, descripcion = $2';
        let values = [titulo, descripcion, id];
        let paramIndex = 3;

        // Si se envían archivos, req.files existirá (si se usa upload.array() en el router)
        if (req.files && req.files.length > 0) {
            // Guardar nuevos archivos
            const archivosUrl = req.files.map(file => {
                saveFile(file); // Guarda el archivo
                return `http://localhost:4000/upload/${file.originalname}`;
            });
            
            const nuevoContenido = { archivos: archivosUrl };
            
            // Añadir contenido al update
            updateFields += `, contenido = $${paramIndex}`;
            values.splice(paramIndex - 1, 0, nuevoContenido);
            paramIndex++; 

        }
        
        const result = await pool.query(
            `UPDATE tema
            SET ${updateFields}
            WHERE id_tema = $${paramIndex}
            RETURNING *`,
            values
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Tema no encontrado" });

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    upload,
    getAllTema,
    getTema,
    createTema,
    deleteTema,
    updateTema
};