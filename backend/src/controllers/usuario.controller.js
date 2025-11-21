const pool = require('../db');

// Obtener todos los usuarios
const getAllUsuario = async (req, res, next) => {
    try {
        const allUsuario = await pool.query("SELECT * FROM usuario WHERE estado = 'Habilitado'");
        res.json(allUsuario.rows);
    } catch (error) {
        next(error);
    }
};

// Obtener un usuario por ID
const getUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM usuario WHERE id_usuario = $1 AND estado = 'Habilitado'", [id]);

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Usuario no encontrado" });

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};


const createUsuario = async (req, res, next) => {
  const { paterno, materno, nombre, correo, rol, celular, fecha_naci } = req.body;

  try {
    // Verificar si ya existe un usuario con el mismo nombre completo y rol
    const usuarioExistente = await pool.query(
      `SELECT * FROM usuario 
       WHERE LOWER(nombre) = LOWER($1)
         AND LOWER(paterno) = LOWER($2)
         AND LOWER(materno) = LOWER($3)
         AND LOWER(rol) = LOWER($4)
         AND estado = 'Habilitado'`,
      [nombre, paterno, materno, rol]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({
        message: `Ya existe un usuario con el nombre "${nombre} ${paterno} ${materno}" y el rol "${rol}".`
      });
    }

    // Crear nuevo usuario si no existe duplicado
    const result = await pool.query(
      `INSERT INTO usuario 
       (paterno, materno, nombre, correo, rol, celular, fecha_naci, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Habilitado') 
       RETURNING *`,
      [paterno, materno, nombre, correo, rol, celular, fecha_naci]
    );

    return res.status(201).json(result.rows[0]);

  } catch (error) {
    next(error);
  }
};


// Eliminar un usuario
const deleteUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query("UPDATE usuario SET estado = 'Deshabilitado' WHERE id_usuario = $1 RETURNING *");

        if (result.rowCount === 0)
            return res.status(404).json({ message: "Usuario no encontrado" });

        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

// Actualizar un usuario
const updateUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { paterno, materno, nombre, correo, rol, celular, fecha_naci } = req.body;

        const result = await pool.query(
            `UPDATE usuario 
            SET paterno = $1, materno = $2, nombre = $3, correo = $4, rol = $5, 
                celular = $6, fecha_naci = $7
            WHERE id_usuario = $8
            RETURNING *`,
            [paterno, materno, nombre, correo, rol, celular, fecha_naci, id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Usuario no encontrado" });

        return res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsuario,
    getUsuario,
    createUsuario,
    deleteUsuario,
    updateUsuario
};
