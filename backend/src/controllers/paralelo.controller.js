const pool = require('../db');

const getAllParalelo = async(req, res, next) =>{
    try{
        const allParalelo = await pool.query("SELECT * FROM paralelo WHERE estado = 'Habilitado'");
        res.json(allParalelo.rows);
    }catch(error){
        next(error);
    }
};

const getParalelo = async(req, res, next) =>{
    
    try{
        const {id} = req.params;
    
    const result = await pool.query("SELECT * FROM paralelo WHERE id_paralelo = $1 AND estado = 'Habilitado'" , [id]);
    
    if(result.rows.length === 0)
        return res.status(404).json({
            message:"Paralelo not found",
    });
    
    return res.json(result.rows[0]);
    }catch(error){
        next(error);
    }
    
};


// Crear un nuevo paralelo
const createParalelo = async (req, res, next) => {
  const {
    hora_ini,
    hora_fin,
    fecha_ini,
    fecha_fin,
    dia,
    modalidad,
    enlace,
    nombre_paralelo,
    nombre_tutoria,
    nombre_institucion,
    nombre,
    paterno,
    materno,
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verificar institución
    const inst = await client.query(
      `SELECT id_institucion
       FROM institucion
       WHERE nombre_institucion = $1 AND estado = 'Habilitado'`,
      [nombre_institucion]
    );
    if (inst.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: `Institución "${nombre_institucion}" no encontrada o deshabilitada.`,
      });
    }
    const id_institucion = inst.rows[0].id_institucion;

    // Verificar tutor (por nombre, paterno y materno)
    const tutor = await client.query(
      `SELECT t.id_tutor
       FROM tutor t
       INNER JOIN usuario u ON u.id_usuario = t.id_usuario
       WHERE u.nombre = $1
         AND u.paterno = $2
         AND u.materno = $3
         AND u.rol = 'Tutor'
         AND u.estado = 'Habilitado'
         AND t.estado = 'Habilitado'`,
      [nombre, paterno, materno]
    );

    if (tutor.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: `El usuario ${nombre} ${paterno} ${materno} no es un tutor activo.`,
      });
    }
    const id_tutor = tutor.rows[0].id_tutor;

    // Verificar que la tutoría exista y pertenezca a la institución
    const tutoria = await client.query(
      `SELECT id_tutoria
       FROM tutoria
       WHERE nombre_tutoria = $1
         AND id_institucion = $2
         AND estado = 'Habilitado'`,
      [nombre_tutoria, id_institucion]
    );
    if (tutoria.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: `No se encontró una tutoría "${nombre_tutoria}" en la institución "${nombre_institucion}".`,
      });
    }
    const id_tutoria = tutoria.rows[0].id_tutoria;

    // Verificar duplicado
    const duplicado = await client.query(
      `SELECT id_paralelo
       FROM paralelo
       WHERE nombre_paralelo = $1 AND id_tutoria = $2 AND estado = 'Habilitado'`,
      [nombre_paralelo, id_tutoria]
    );
    if (duplicado.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        message: `Ya existe un paralelo "${nombre_paralelo}" para la tutoría "${nombre_tutoria}".`,
      });
    }

    // Crear el nuevo paralelo
    const nuevoParalelo = await client.query(
      `INSERT INTO paralelo (
        hora_ini, hora_fin, fecha_ini, fecha_fin, dia, modalidad, enlace,
        nombre_paralelo, id_tutor, id_tutoria, estado
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Habilitado')
      RETURNING *`,
      [
        hora_ini,
        hora_fin,
        fecha_ini,
        fecha_fin,
        dia,
        modalidad,
        enlace,
        nombre_paralelo,
        id_tutor,
        id_tutoria
      ]
    );

    await client.query('COMMIT');
    return res.status(201).json({
      message: 'Paralelo creado exitosamente.',
      paralelo: nuevoParalelo.rows[0],
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear el paralelo:', error);
    next(error);
  } finally {
    client.release();
  }
};

//Eliminar Institucion (Ajustada para paralelo)
const deleteParalelo = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Actualiza el estado a "Deshabilitado"
    const result = await pool.query(
      "UPDATE paralelo  SET estado = 'Deshabilitado' WHERE id_paralelo = $1 RETURNING *", // Corregido: 'Desabilitado' -> 'Deshabilitado' y cierre de comilla
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Paralelo no encontrado",
      });
    }

    res.status(200).json({
      message: "Paralelo deshabilitado correctamente",
      paralelo: result.rows[0], // Corregido el nombre de la propiedad de respuesta
    });
  } catch (error) {
    next(error);
  }
};


const updateParalelo = async(req, res, next) =>{
    try{
        const { id } = req.params;
    const {hora_ini, hora_fin, fecha_ini, fecha_fin, dia, modalidad, enlace, nombre_paralelo} = req.body;

    const result = await pool.query(
        // Corregido: $5 en el WHERE apuntaba a 'dia'. Ahora apunta al 'id' de la URL.
        "UPDATE paralelo SET hora_ini = $1, hora_fin = $2, fecha_ini = $3, fecha_fin = $4, dia = $5, modalidad = $6, enlace = $7, nombre_paralelo = $8 WHERE id_paralelo = $9 RETURNING *",
        [hora_ini, hora_fin, fecha_ini, fecha_fin, dia, modalidad, enlace, nombre_paralelo, id]
    );
    if(result.rows.length === 0)return res.status(404).json({
        message:"Paralelo not found",
    });


    return res.json(result.rows[0])
    }catch(error){
        next(error)
    }
};
module.exports = {
    getAllParalelo,
    getParalelo,
    createParalelo,
    deleteParalelo,
    updateParalelo
}
