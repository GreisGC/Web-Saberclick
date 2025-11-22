const pool = require('../db');

const bcrypt = require('bcrypt');
const saltRounds = 10;

//Obtener todos los estudiantes
const getAllGerente = async (req, res, next) => {
// req= objeto de la peticion http, res = respuesta que enviaras al cliente, next=funcion para pasar al siguienete middleware(util para manejo de errorres)

  try {
    const allGerente = await pool.query
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
            g.id_gerente,
            u.id_usuario
            
        FROM usuario u 
        INNER JOIN gerente g 
            ON u.id_usuario = g.id_usuario
        WHERE u.estado = 'Habilitado' AND g.estado = 'Habilitado' AND u.rol ='Gerente';`
    );
    res.json(allGerente.rows);
  } catch (error) {
    next(error);
  }
};

// Obtener un Gerente por ID
const getGerente = async (req, res, next) => {
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
            g.id_gerente
            
        FROM usuario u 
        INNER JOIN gerente g
            ON u.id_usuario = g.id_usuario
        WHERE g.id_gerente = $1 AND g.estado = 'Habilitado';`
        , [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Gerente not found" });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo Gerente (id_usuario viene del usuario existente)
const createGerente = async (req, res, next) => {
    const { 
            paterno,
            materno,  
            nombre,
            correo,
            celular,
            fecha_naci,
            password
    } = req.body; 

    const rol = 'Gerente';

    try {
        await pool.query('BEGIN'); 
        //realiza una transaccion en postgresql

		const newpassword = await bcrypt.hash(password,saltRounds);

        const userResult = await pool.query(
            "INSERT INTO usuario (nombre, paterno, materno, correo, celular, fecha_naci, rol, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_usuario",
            [nombre, paterno, materno, correo, celular, fecha_naci, rol, newpassword] 
        );
        
        const id_usuario_creado = userResult.rows[0].id_usuario;
        //Guarda el id_usuario recien generado para usarlo en la tabla gerente 

        const gerenteResult = await pool.query(
            "INSERT INTO gerente (id_usuario) VALUES ($1) RETURNING *",
            [id_usuario_creado]
        );

        await pool.query('COMMIT'); 

        res.status(201).json({
            message: "Gerente y Usuario creados exitosamente.",
            gerente: gerenteResult.rows[0],
            usuario: userResult.rows[0]
        });

    } catch (error) {
        await pool.query('ROLLBACK'); 
        console.error("Error en la transacción de creación de Gerente:", error.message);
        next(error);
    }
};

// Eliminar tutor
const deleteGerente = async (req, res, next) => {
  try {
    const { id } = req.params; // este "id" es el id_tutor

    // Primero buscamos el tutor para obtener su id_usuario relacionado
    const gerenteResult = await pool.query(
      "SELECT id_usuario FROM gerente WHERE id_gerente = $1",
      [id]
    );

    if (gerenteResult.rowCount === 0)
      return res.status(404).json({ message: "Gerente no encontrado" });

    const idUsuario = gerenteResult.rows[0].id_usuario;

    // Deshabilitar tutor
    await pool.query(
      "UPDATE gerente SET estado = 'Deshabilitado' WHERE id_gerente = $1",
      [id]
    );

    // Deshabilitar usuario relacionado
    await pool.query(
      "UPDATE usuario SET estado = 'Deshabilitado' WHERE id_usuario = $1",
      [idUsuario]
    );

    res.status(200).json({ message: "Gerente y usuario deshabilitados correctamente" });
  } catch (error) {
    next(error);
  }
};

const updateGerente = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { 
            nombre,
            paterno,
            materno,
            correo,
            celular,
            fecha_naci
        } = req.body;

        await pool.query("BEGIN");

        //Obtener el id_gerente del gerente
        const gerenteResult = await pool.query(
            "SELECT id_usuario FROM gerente WHERE id_gerente = $1",
            [id]
        );

        if (gerenteResult.rows.length === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ message: "Gerente no encontrado" });
        }

        const id_usuario = gerenteResult.rows[0].id_usuario;

        // Actualizar datos del usuario (8 placeholders)
        await pool.query(
            `UPDATE usuario 
             SET nombre = $1, paterno = $2, materno = $3, correo = $4, celular = $5, fecha_naci = $6
             WHERE id_usuario = $7`,
            [nombre, paterno, materno, correo, celular, fecha_naci, id_usuario] 
        );

        
        await pool.query("COMMIT");

        res.status(200).json({
            message: "Gerente y usuario actualizados correctamente",
            gerente: updatedGerente.rows[0],
        });

    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error al actualizar Gerente:", error.message);
        next(error);
    }
};

const listarGerentes=async (req, res, next)=>{
	try {
		const result = await pool.query(
			`SELECT g.id_gerente,u.id_usuario,u.nombre,u.paterno,u.materno
			FROM usuario u
			INNER JOIN gerente g ON u.id_usuario=g.id_usuario`
		);
		const rows=result.rows;
		res.json(rows);
	} catch (error) {
		next(error);
	}
}

module.exports = {
  getAllGerente,
  getGerente,
  createGerente,
  deleteGerente,
  updateGerente,
  listarGerentes
};