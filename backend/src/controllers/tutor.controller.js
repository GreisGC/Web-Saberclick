const pool = require('../db');
const fs = require('node:fs');
const path = require('node:path');

const bcrypt = require('bcrypt');
const saltRounds = 10;

// Función para renombrar y guardar el PDF
function savePdf(file) {
    const newPath = `./upload/${file.originalname}`;
    fs.renameSync(file.path, newPath);
    return newPath;
}

// Obtener todos los Tutores
const getAllTutor = async (req, res, next) => {
  try {
    const allTutor = await pool.query(
        `SELECT 
            u.paterno,
            u.materno,  
            u.nombre,
            u.correo,
            u.rol,
            u.celular,
            u.fecha_naci,
            u.fecha_registro,
            u.estado,
            t.especialidad,
            t.anos_experiencia,
            t.cv,
            t.id_tutor,
            u.id_usuario
        FROM usuario u 
        INNER JOIN tutor t 
            ON u.id_usuario = t.id_usuario
        WHERE u.estado = 'Habilitado' 
          AND t.estado = 'Habilitado' 
          AND u.rol = 'Tutor'`
    );
    res.json(allTutor.rows);
  } catch (error) {
    next(error);
  }
};

// Obtener un Tutor por ID
const getTutor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
        `SELECT 
            u.paterno,
            u.materno,  
            u.nombre,
            u.correo,
            u.rol,
            u.celular,
            u.fecha_naci,
            u.fecha_registro,
            u.estado,
            t.especialidad,
            t.anos_experiencia,
            t.cv,
            t.id_tutor
        FROM usuario u 
        INNER JOIN tutor t 
            ON u.id_usuario = t.id_usuario
        WHERE t.id_tutor = $1 AND t.estado = 'Habilitado'`,
        [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Tutor no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo Tutor con CV en PDF
const createTutor = async (req, res, next) => {
    try {
        const { 
            paterno,
            materno,  
            nombre,
            correo,
            celular,
            fecha_naci,
            especialidad,
            anos_experiencia,
			password
        } = req.body;

        const rol = 'Tutor';

		const newpassword = await bcrypt.hash(password,saltRounds);

        // Validar archivo PDF
        if (!req.file) {
            return res.status(400).json({ error: "Debes enviar el archivo PDF del CV en el campo 'cv'" });
        }

        // Guardar PDF en /upload
        const pdfPath = savePdf(req.file);

        // URL pública del PDF
        const pdfUrl = `http://localhost:4000/${pdfPath.replace('./', '')}`;

        await pool.query('BEGIN');

        // Crear usuario
        const userResult = await pool.query(
            "INSERT INTO usuario (nombre, paterno, materno, correo, celular, fecha_naci, rol, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_usuario",
            [nombre, paterno, materno, correo, celular, fecha_naci, rol, newpassword]
        );

        const id_usuario_creado = userResult.rows[0].id_usuario;

        // Crear tutor
        const tutorResult = await pool.query(
            "INSERT INTO tutor (especialidad, anos_experiencia, cv, id_usuario) VALUES ($1, $2, $3, $4) RETURNING *",
            [especialidad, anos_experiencia, pdfUrl, id_usuario_creado]
        );

        await pool.query('COMMIT');

        res.status(201).json({
            message: "Tutor creado correctamente con CV PDF",
            tutor: tutorResult.rows[0],
            usuario: userResult.rows[0]
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error creando Tutor:", error.message);
        next(error);
    }
};

// Actualizar Tutor
// Actualizar Tutor (solo update)
const updateTutor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paterno, materno, nombre, correo, celular, fecha_naci, especialidad, anos_experiencia } = req.body;

    await pool.query("BEGIN");

    // Obtener id_usuario y CV actual
    const tutorResult = await pool.query(
      "SELECT id_usuario, cv FROM tutor WHERE id_tutor = $1",
      [id]
    );

    if (tutorResult.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ message: "Tutor no encontrado" });
    }

    const id_usuario = tutorResult.rows[0].id_usuario;
    let cvUrl = tutorResult.rows[0].cv; // URL actual

    // Si envía un nuevo PDF, guardarlo y actualizar la URL
    if (req.file) {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${req.file.originalname.replace(/\s/g, '-')}`;
      const newPath = `./upload/${fileName}`;

      // Renombrar y mover archivo
      const fs = require("fs");
      fs.renameSync(req.file.path, newPath);

      cvUrl = `http://localhost:4000/upload/${fileName}`;
    }

    // Actualizar datos de usuario
    await pool.query(
      `UPDATE usuario 
       SET nombre=$1, paterno=$2, materno=$3, correo=$4, celular=$5, fecha_naci=$6 
       WHERE id_usuario = $7`,
      [nombre, paterno, materno, correo, celular, fecha_naci, id_usuario]
    );

    // Actualizar tutor
    const updatedTutor = await pool.query(
      `UPDATE tutor
       SET especialidad=$1, anos_experiencia=$2, cv=$3
       WHERE id_tutor=$4
       RETURNING *`,
      [especialidad, anos_experiencia, cvUrl, id]
    );

    await pool.query("COMMIT");

    res.status(200).json({
      message: "Tutor actualizado correctamente",
      tutor: updatedTutor.rows[0],
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al actualizar Tutor:", error.message);
    next(error);
  }
};

const deleteTutor = async (req, res, next) => {
  try {
    const { id } = req.params; // este "id" es el id_tutor

    // Primero buscamos el tutor para obtener su id_usuario relacionado
    const tutorResult = await pool.query(
      "SELECT id_usuario FROM tutor WHERE id_tutor = $1",
      [id]
    );

    if (tutorResult.rowCount === 0)
      return res.status(404).json({ message: "Tutor no encontrado" });

    const idUsuario = tutorResult.rows[0].id_usuario;

    // Deshabilitar tutor
    await pool.query(
      "UPDATE tutor SET estado = 'Deshabilitado' WHERE id_tutor = $1",
      [id]
    );

    // Deshabilitar usuario relacionado
    await pool.query(
      "UPDATE usuario SET estado = 'Deshabilitado' WHERE id_usuario = $1",
      [idUsuario]
    );

    res.status(200).json({ message: "Tutor y usuario deshabilitados correctamente" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTutor,
  getTutor,
  createTutor,
  deleteTutor,
  updateTutor
};


