const pool = require('../db');

const bcrypt = require('bcrypt');
const saltRounds = 10;

//Obtener todos los estudiantes
const getAllEstudiante = async (req, res, next) => {
// req= objeto de la peticion http, res = respuesta que enviaras al cliente, next=funcion para pasar al siguienete middleware(util para manejo de errorres)

  try {
    const allEstudiante = await pool.query
    //ejecuta una consulta a la base de datos usando pool.query
    //await espera a que la consulta termine y devuelva el resultado
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
            u.id_usuario,
            e.id_estudiante
            
        FROM usuario u 
        INNER JOIN estudiante e 
            ON u.id_usuario = e.id_usuario
        WHERE u.estado = 'Habilitado' AND e.estado = 'Habilitado' AND u.rol ='Estudiante';`
    );
    res.json(allEstudiante.rows);
  } catch (error) {
    next(error);
  }
};

// Obtener un Estudiante por ID
const getEstudiante = async (req, res, next) => {
  try {
    const { id } = req.params;
    // extrae el id de la URL
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
            e.id_estudiante
            
        FROM usuario u 
        INNER JOIN estudiante e 
            ON u.id_usuario = e.id_usuario
        WHERE e.id_estudiante = $1 AND e.estado = 'Habilitado';`
        , [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Estudiante not found" });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo Estudiante (id_usuario viene del usuario existente)
const createEstudiante = async (req, res, next) => {
    const { 
            paterno,
            materno,  
            nombre,
            correo,
            celular,
            fecha_naci,
            password
    } = req.body; 

    const rol = 'Estudiante';

    try {
        await pool.query('BEGIN'); 
        //realiza una transaccion en postgresql

		const newpassword = await bcrypt.hash(password,saltRounds);

        const userResult = await pool.query(
            "INSERT INTO usuario (nombre, paterno, materno, correo, celular, fecha_naci, rol, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_usuario",
            [nombre, paterno, materno, correo, celular, fecha_naci, rol, newpassword] 
        );
        
        const id_usuario_creado = userResult.rows[0].id_usuario;
        //Guarda el id_usuario recien generado para usarlo en la tabla estudiante 

        const estudianteResult = await pool.query(
            "INSERT INTO estudiante (id_usuario) VALUES ($1) RETURNING *",
            [id_usuario_creado]
        );

        await pool.query('COMMIT'); 

        res.status(201).json({
            message: "Estudiante y Usuario creados exitosamente.",
            estudiante: estudianteResult.rows[0],
            usuario: userResult.rows[0]
        });

    } catch (error) {
        await pool.query('ROLLBACK'); 
        console.error("Error en la transacción de creación de Estudiante:", error.message);
        next(error);
    }
};

// Eliminar tutor
const deleteEstudiante = async (req, res, next) => {
  try {
    const { id } = req.params; // este "id" es el id_tutor

    // Primero buscamos el tutor para obtener su id_usuario relacionado
    const estudianteResult = await pool.query(
      "SELECT id_usuario FROM estudiante WHERE id_estudiante = $1",
      [id]
    );

    if (estudianteResult.rowCount === 0)
      return res.status(404).json({ message: "Estudiante no encontrado" });

    const idUsuario = estudianteResult.rows[0].id_usuario;

    // Deshabilitar tutor
    await pool.query(
      "UPDATE estudiante SET estado = 'Deshabilitado' WHERE id_estudiante = $1",
      [id]
    );

    // Deshabilitar usuario relacionado
    await pool.query(
      "UPDATE usuario SET estado = 'Deshabilitado' WHERE id_usuario = $1",
      [idUsuario]
    );

    res.status(200).json({ message: "Estudiante y usuario deshabilitados correctamente" });
  } catch (error) {
    next(error);
  }
};

const updateEstudiante = async (req, res, next) => {
    try {
        const { id } = req.params; // id es id_estudiante
        
        // Solo desestructuramos los campos que se van a actualizar
        const { 
            nombre,
            paterno,
            materno,
            correo,
            celular,
            fecha_naci,
        } = req.body; // NOTA: 'estado' fue eliminado de aquí

        await pool.query("BEGIN");

        // 1. Obtener el id_usuario del estudiante
        const estudianteResult = await pool.query(
            "SELECT id_usuario FROM estudiante WHERE id_estudiante = $1",
            [id]
        );

        if (estudianteResult.rows.length === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        const id_usuario = estudianteResult.rows[0].id_usuario;

        // 2. Actualizar datos del usuario (6 placeholders para los campos de req.body)
        await pool.query(
            `UPDATE usuario 
             SET nombre = $1, paterno = $2, materno = $3, correo = $4, celular = $5, fecha_naci = $6
             WHERE id_usuario = $7`,
            [nombre, paterno, materno, correo, celular, fecha_naci, id_usuario] 
        );

        const updatedEstudianteResult = await pool.query(
            `SELECT * FROM estudiante WHERE id_estudiante = $1`,
            [id] 
        );


        await pool.query("COMMIT");

        res.status(200).json({
            message: "Usuario actualizado correctamente. Estado de estudiante no modificado.",
            estudiante: updatedEstudianteResult.rows[0],
        });

    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error al actualizar Estudiante:", error.message);
        next(error);
    }
};

module.exports = {
  getAllEstudiante,
  getEstudiante,
  createEstudiante,
  deleteEstudiante,
  updateEstudiante
};