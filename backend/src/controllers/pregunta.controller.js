const pool = require('../db');

// Obtener las Preguntas
const getAllPregunta = async (req, res, next) => {
    try {
        const allpregunta = await pool.query("SELECT * FROM pregunta WHERE estado = 'Habilitado'");
        res.json(allpregunta.rows);
    } catch (error) {
        next(error);
    }
};

// Obtener un Pregunta por ID
const getPregunta = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM pregunta WHERE id_pregunta = $1 AND estado = 'Habilitado'", [id]);

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Pregunta no encontrado" });

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

//Crear Pregunta
const createPregunta = async (req, res, next) => {
  const { 
    nro_pregunta, 
    enunciado, 
    resp_correcta, 
    nombre_tutoria, 
    nombre_institucion 
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verificar institución
    const instResult = await client.query(
      `SELECT id_institucion
       FROM institucion
       WHERE nombre_institucion = $1 AND estado = 'Habilitado'`,
      [nombre_institucion]
    );

    if (instResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res
        .status(404)
        .json({ message: `Institución "${nombre_institucion}" no encontrada o deshabilitada.` });
    }

    const id_institucion = instResult.rows[0].id_institucion;

    // Verificar tutoría asociada a esa institución
    const tutoriaResult = await client.query(
      `SELECT id_tutoria
       FROM tutoria
       WHERE nombre_tutoria = $1
         AND id_institucion = $2
         AND estado = 'Habilitado'`,
      [nombre_tutoria, id_institucion]
    );

    if (tutoriaResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: `No se encontró una tutoría llamada "${nombre_tutoria}" asociada a la institución "${nombre_institucion}".`,
      });
    }

    const id_tutoria = tutoriaResult.rows[0].id_tutoria;

    // Crear la pregunta
    const preguntaResult = await client.query(
      `INSERT INTO pregunta (nro_pregunta, enunciado, resp_correcta, id_tutoria)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nro_pregunta, enunciado, resp_correcta, id_tutoria]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      message: 'Pregunta creada correctamente.',
      pregunta: preguntaResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear la pregunta:', error);
    next(error);
  } finally {
    client.release();
  }
};

// Eliminar un Pregunta
const deletePregunta = async (req, res, next) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        await client.query('BEGIN'); 

        // Deshabilitar la pregunta
        const preguntaResult = await client.query(
            "UPDATE pregunta SET estado = 'Deshabilitado' WHERE id_pregunta = $1 RETURNING *",
            [id]
        );

        if (preguntaResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Pregunta no encontrada" });
        }

        //Deshabilitar las opciones relacionadas
        await client.query(
            "UPDATE opcion SET estado = 'Deshabilitado' WHERE id_pregunta = $1",
            [id]
        );

        await client.query('COMMIT'); 

        return res.status(200).json({
            message: "Pregunta y opciones relacionadas deshabilitadas correctamente",
        });
    } catch (error) {
        await client.query('ROLLBACK'); 
        console.error("Error al deshabilitar la pregunta:", error);
        next(error);
    } finally {
        client.release(); 
    }
};

// Actualizar una Pregunta
const updatePregunta = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const { nro_pregunta, enunciado, resp_correcta} = req.body; 
        
        const result = await pool.query(
            `UPDATE pregunta 
            SET nro_pregunta = $1, enunciado = $2, resp_correcta = $3
            WHERE id_pregunta = $4
            RETURNING *`,
            [nro_pregunta, enunciado, resp_correcta, id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Pregunta no encontrado" });

        return res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPregunta,
    getPregunta,
    createPregunta,
    deletePregunta,
    updatePregunta
};