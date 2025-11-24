const pool = require('../db');

const bcrypt = require('bcrypt');
const saltRounds = 10;

// Obtener todos los Administrador
const getAllAdministrador = async (req, res, next) => {
  try {
    const allAdministrador = await pool.query
    (
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
            a.cargo,
            a.id_admin,
            u.id_usuario
            
        FROM usuario u 
        INNER JOIN administrador a 
            ON u.id_usuario = a.id_usuario
        WHERE u.estado = 'Habilitado' AND a.estado = 'Habilitado' AND u.rol ='Administrador';`
    );
    res.json(allAdministrador.rows);
  } catch (error) {
    next(error);
  }
};

// Obtener un Administrador por ID
const getAdministrador = async (req, res, next) => {
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
            a.cargo,
            a.id_admin
            
        FROM usuario u 
        INNER JOIN administrador a 
            ON u.id_usuario = a.id_usuario
        WHERE a.id_admin = $1 AND a.estado = 'Habilitado';`
        , [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Administrador not found" });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo Administrador (id_usuario viene del usuario existente)
const createAdministrador = async (req, res, next) => {
    const { 
            paterno,
            materno,  
            nombre,
            correo,
            celular,
            fecha_naci,
            cargo,
            password
    } = req.body; 

    const rol = 'Administrador';
     
    try {
        await pool.query('BEGIN'); 
     
		const newpassword = await bcrypt.hash(password,saltRounds);
        
        const userResult = await pool.query(
            "INSERT INTO usuario (nombre, paterno, materno, correo, celular, fecha_naci, rol, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_usuario",
            [nombre, paterno, materno, correo, celular, fecha_naci, rol, newpassword] 
        );
        
        const id_usuario_creado = userResult.rows[0].id_usuario; 

        const administradorResult = await pool.query(
            "INSERT INTO administrador (cargo, id_usuario) VALUES ($1, $2) RETURNING *",
            [cargo, id_usuario_creado]
        );

        await pool.query('COMMIT'); 

        res.status(201).json({
            message: "Administrador y Usuario creados exitosamente.",
            administrador: administradorResult.rows[0],
            usuario: userResult.rows[0]
        });

    } catch (error) {
        await pool.query('ROLLBACK'); 
        console.error("Error en la transacción de creación de Administrador:", error.message);
        next(error);
    }
};

// Eliminar Administrador
const deleteAdministrador = async (req, res, next) => {
  try {
    const { id } = req.params; // este "id" es el id_admin

    // Primero buscamos el administrador para obtener su id_usuario relacionado
    const administradorResult = await pool.query(
      "SELECT id_usuario FROM administrador WHERE id_admin= $1",
      [id]
    );

    if (administradorResult.rowCount === 0)
      return res.status(404).json({ message: "Administrador no encontrado" });

    const idUsuario = administradorResult.rows[0].id_usuario;

    // Deshabilitar administrador
    await pool.query(
      "UPDATE administrador SET estado = 'Deshabilitado' WHERE id_admin = $1",
      [id]
    );

    // Deshabilitar usuario relacionado
    await pool.query(
      "UPDATE usuario SET estado = 'Deshabilitado' WHERE id_usuario = $1",
      [idUsuario]
    );

    res.status(200).json({ message: "Administrador y usuario deshabilitados correctamente" });
  } catch (error) {
    next(error);
  }
};


// Actualizar Administrador
const updateAdministrador = async (req, res, next) => {
    try {
        const { id } = req.params; // id es id_tutor
        const { 
            nombre,
            paterno,
            materno,
            correo,
            celular,
            fecha_naci,
            cargo,
        } = req.body;

        await pool.query("BEGIN");

        // 1️Obtener el id_usuario del tutor
        const administradorResult = await pool.query(
            "SELECT id_usuario FROM administrador WHERE id_admin = $1",
            [id]
        );

        if (administradorResult.rows.length === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ message: "Administrador no encontrado" });
        }

        const id_usuario = administradorResult.rows[0].id_usuario;

        // Actualizar datos del administrador
        await pool.query(
            `UPDATE usuario 
             SET nombre = $1, paterno = $2, materno = $3, correo = $4, celular = $5, fecha_naci = $6
             WHERE id_usuario = $7`,
            [nombre, paterno, materno, correo, celular, fecha_naci, id_usuario] 
        );

        // Actualizar datos del administrador
        const updatedAdministrador = await pool.query(
            `UPDATE administrador 
             SET cargo = $1
             WHERE id_admin = $2
             RETURNING *`,
            [cargo, id] 
        );

        await pool.query("COMMIT");

        res.status(200).json({
            message: "Administrador y usuario actualizados correctamente",
            administrador: updatedAdministrador.rows[0],
        });

    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error al actualizar Administrador:", error.message);
        next(error);
    }
};


module.exports = {
  getAllAdministrador,
  getAdministrador,
  createAdministrador,
  deleteAdministrador,
  updateAdministrador
};