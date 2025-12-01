const pool = require('../db');

const getAllInstitucion = async(req, res, next) =>{
    try{
        const allInstitucion = await pool.query("SELECT * FROM institucion WHERE estado = 'Habilitado'");
        res.json(allInstitucion.rows);
    }catch(error){
        next(error);
    }
};

const getAllInstitucionByGerente = async(req, res, next) =>{
    try{
		const {id_gerente}=req.params
        const allInstitucion = await pool.query("SELECT * FROM institucion WHERE estado = 'Habilitado' AND id_gerente= $1",[id_gerente]);
        res.json(allInstitucion.rows);
    }catch(error){
        next(error);
    }
};

const getInstitucion = async(req, res, next) =>{
    
    try{
        const {id} = req.params;
    
    const result = await pool.query("SELECT * FROM institucion WHERE id_institucion = $1 AND estado = 'Habilitado'" , [id]);
    
    if(result.rows.length === 0)
        return res.status(404).json({
            message:"Institucion not found",
    });
    
    return res.json(result.rows[0]);
    }catch(error){
        next(error);
    }
    
};

const createInstitucion = async (req, res, next) => {
  const {
    nombre_institucion,
    direccion,
    celular,
    descripcion,
    nombre,
    paterno,
    materno
  } = req.body;

  try {
    await pool.query('BEGIN'); // inicia la transacción

    // Buscar el usuario por nombre y apellidos
    const userResult = await pool.query(
      `SELECT id_usuario, rol FROM usuario 
       WHERE nombre = $1 AND paterno = $2 AND materno = $3`,
      [nombre, paterno, materno]
    );

    if (userResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const usuario = userResult.rows[0];

    // Verificar que el usuario tenga el rol de Gerente
    if (usuario.rol !== 'Gerente') {
      await pool.query('ROLLBACK');
      return res.status(400).json({ message: "El usuario no tiene rol de Gerente" });
    }

    // Buscar el id_gerente en la tabla gerente
    const gerenteResult = await pool.query(
      `SELECT id_gerente FROM gerente WHERE id_usuario = $1`,
      [usuario.id_usuario]
    );

    if (gerenteResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: "No existe un gerente asociado a este usuario" });
    }

    const id_gerente = gerenteResult.rows[0].id_gerente;

    // Crear la institución asociada al gerente
    const institucionResult = await pool.query(
      `INSERT INTO institucion (nombre_institucion, direccion, celular, descripcion, id_gerente)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre_institucion, direccion, celular, descripcion, id_gerente]
    );

    await pool.query('COMMIT');

    res.status(201).json({
      message: 'Institución creada correctamente',
      institucion: institucionResult.rows[0],
    });

  } catch (error) {
    await pool.query('ROLLBACK');
    next(error);
  }
};

//Eliminar Institucion
const deleteInstitucion = async (req, res, next) => {
  const client = await pool.connect(); // conexión individual para transacción

  try {
    const { id } = req.params;

    await client.query('BEGIN'); // inicia transacción

    // Deshabilitar la institución
    const institucionResult = await client.query(
      "UPDATE institucion SET estado = 'Deshabilitado' WHERE id_institucion = $1 RETURNING *",
      [id]
    );

    if (institucionResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "Institución no encontrada" });
    }

    // Deshabilitar las tutorías asociadas
    const tutoriaResult = await client.query(
      "UPDATE tutoria SET estado = 'Deshabilitado' WHERE id_institucion = $1 RETURNING id_tutoria",
      [id]
    );

    const tutoriasDeshabilitadas = tutoriaResult.rows.map(r => r.id_tutoria);

    //Deshabilitar paralelos asociados a las tutorías
    if (tutoriasDeshabilitadas.length > 0) {
      await client.query(
        `UPDATE paralelo 
         SET estado = 'Deshabilitado' 
         WHERE id_tutoria = ANY($1::int[])`,
        [tutoriasDeshabilitadas]
      );
    }

    // Deshabilitar temas asociados a la institución
    await client.query(
      "UPDATE tema SET estado = 'Deshabilitado' WHERE id_institucion = $1",
      [id]
    );

    //Deshabilitar preguntas asociadas a las tutorías
    if (tutoriasDeshabilitadas.length > 0) {
      const preguntaResult = await client.query(
        `UPDATE pregunta 
         SET estado = 'Deshabilitado' 
         WHERE id_tutoria = ANY($1::int[]) 
         RETURNING id_pregunta`,
        [tutoriasDeshabilitadas]
      );

      const preguntasDeshabilitadas = preguntaResult.rows.map(r => r.id_pregunta);

      //Deshabilitar opciones asociadas a las preguntas
      if (preguntasDeshabilitadas.length > 0) {
        await client.query(
          `UPDATE opcion 
           SET estado = 'Deshabilitado' 
           WHERE id_pregunta = ANY($1::int[])`,
          [preguntasDeshabilitadas]
        );
      }
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: "Institución y sus entidades relacionadas deshabilitadas correctamente",
      institucion: institucionResult.rows[0],
    });

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};



const updateInstitucion = async(req, res, next) =>{
    try{
        const { id } = req.params;
    const {nombre_institucion, direccion, celular, descripcion} = req.body;

    const result = await pool.query(
        "UPDATE institucion SET nombre_institucion = $1, direccion = $2, celular = $3, descripcion = $4 WHERE id_institucion = $5 RETURNING *",
        [nombre_institucion, direccion, celular, descripcion, id]
    );
    if(result.rows.length === 0)return res.status(404).json({
        message:"Institucion not found",
    });


    return res.json(result.rows[0])
    }catch(error){
        next(error)
    }
};
module.exports = {
    getAllInstitucion,
    getInstitucion,
    createInstitucion,
    deleteInstitucion,
    updateInstitucion,
	getAllInstitucionByGerente
}