const pool = require('../db');

// Obtener todas las Respuestas
const getAllRespuesta = async (req, res, next) => {
  try {
    const allPago = await pool.query("SELECT * FROM respuesta_ev WHERE estado = 'Habilitado'");
    res.json(allPago.rows);
  } catch (error) {
    next(error);
  }
};

// Obtener Respuesta por ID
const getRespuesta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM respuesta_ev WHERE id_respuesta = $1 AND estado = 'Habilitado'",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Respuesta no encontrada no encontrada" });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Crear Respuesta con verificaciones completas
const createRespuesta = async (req, res, next) => {
  const {
    nro_intentos,
    nro_pregunta,
    inciso,

    nombre_institucion,
    nombre_tutoria,

    nombre_paralelo,
    hora_ini,
    hora_fin,
    fecha_ini,
    fecha_fin,
    dia,

    nombre_estudiante,
    paterno_estudiante,
    materno_estudiante
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. VERIFICAR INSTITUCIÓN
    const inst = await client.query(
      `SELECT id_institucion
       FROM institucion
       WHERE nombre_institucion = $1 AND estado = 'Habilitado'`,
      [nombre_institucion]
    );

    if (inst.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: `La institución ${nombre_institucion} no existe o está deshabilitada`
      });
    }

    const id_institucion = inst.rows[0].id_institucion;

    // 2. VERIFICAR TUTORÍA pertenece a institución
    const tutoria = await client.query(
      `SELECT id_tutoria
       FROM tutoria
       WHERE nombre_tutoria = $1 
         AND id_institucion = $2
         AND estado = 'Habilitado'`,
      [nombre_tutoria, id_institucion]
    );

    if (tutoria.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: `La tutoría ${nombre_tutoria} no pertenece a la institución ${nombre_institucion}`
      });
    }

    const id_tutoria = tutoria.rows[0].id_tutoria;

    // 3. VERIFICAR PARALELO pertenece a tutoría
    const paralelo = await client.query(
      `SELECT id_paralelo
       FROM paralelo
       WHERE nombre_paralelo = $1
         AND hora_ini = $2
         AND hora_fin = $3
         AND fecha_ini = $4
         AND fecha_fin = $5
         AND dia = $6
         AND id_tutoria = $7
         AND estado = 'Habilitado'`,
      [nombre_paralelo, hora_ini, hora_fin, fecha_ini, fecha_fin, dia, id_tutoria]
    );

    if (paralelo.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: `El paralelo ${nombre_paralelo} no pertenece a la tutoría ${nombre_tutoria}`
      });
    }

    const id_paralelo = paralelo.rows[0].id_paralelo;

    // 4. VERIFICAR ESTUDIANTE
    const estudiante = await client.query(
      `SELECT e.id_estudiante
       FROM estudiante e
       INNER JOIN usuario u ON u.id_usuario = e.id_usuario
       WHERE u.nombre = $1 AND u.paterno = $2 AND u.materno = $3
         AND u.rol = 'Estudiante'
         AND u.estado = 'Habilitado'
         AND e.estado = 'Habilitado'`,
      [nombre_estudiante, paterno_estudiante, materno_estudiante]
    );

    if (estudiante.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: `El estudiante ${nombre_estudiante} ${paterno_estudiante} ${materno_estudiante} no está habilitado`
      });
    }

    const id_estudiante = estudiante.rows[0].id_estudiante;

    // 5. VERIFICAR INSCRIPCIÓN (tutoria - paralelo - estudiante)
    const inscripcion = await client.query(
      `SELECT id_inscripcion
       FROM inscripcion
       WHERE id_tutoria = $1
         AND id_paralelo = $2
         AND id_estudiante = $3
         AND estado = 'Habilitado'`,
      [id_tutoria, id_paralelo, id_estudiante]
    );

    if (inscripcion.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: `El estudiante no está inscrito en esa tutoría y paralelo`
      });
    }

    const id_inscripcion = inscripcion.rows[0].id_inscripcion;

    // 6. CREAR RESPUESTA EV
    const respuesta = await client.query(
      `INSERT INTO respuesta_ev
      (nro_intentos, nro_pregunta, inciso, id_inscripcion, estado)
      VALUES ($1, $2, $3, $4, 'Habilitado')
      RETURNING *`,
      [nro_intentos, nro_pregunta, inciso, id_inscripcion]
    );

    await client.query("COMMIT");

    return res.json({
      message: "Respuesta creada exitosamente",
      respuesta: respuesta.rows[0]
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error en createRespuesta:", error);
    next(error);
  } finally {
    client.release();
  }
};

// Eliminar una Inscripcion (deshabilitar)
const deleteRespuesta = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query('BEGIN');

    // Verificar que exista
    const respuestaResult = await pool.query(
      `SELECT * FROM respuesta_ev 
       WHERE id_respuesta = $1 AND estado = 'Habilitado'`,
      [id]
    );

    if (respuestaResult.rowCount === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({
        message: "Respuesta no encontrada o ya deshabilitada"
      });
    }

    // Deshabilitar
    const respuestaUpdate = await pool.query(
      `UPDATE respuesta_ev
       SET estado = 'Deshabilitado'
       WHERE id_respuesta = $1
       RETURNING *`,
      [id]
    );

    await pool.query('COMMIT');

    return res.status(200).json({
      message: "Respuesta deshabilitada correctamente",
      respuesta: respuestaUpdate.rows[0]
    });

  } catch (error) {
    await pool.query('ROLLBACK');
    next(error);
  }
};

// Actualizar una Inscripcion
const updateRespuesta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nro_intentos, nro_pregunta, inciso } = req.body;

    const result = await pool.query(
      `UPDATE respuesta_ev
       SET nro_intentos = $1,
           nro_pregunta = $2,
           inciso = $3
       WHERE id_respuesta = $4
       RETURNING *`,
      [nro_intentos, nro_pregunta, inciso, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Respuesta no encontrada" });
    }

    return res.json({
      message: "Respuesta actualizada correctamente",
      respuesta: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
};



module.exports = {
  getAllRespuesta,
  getRespuesta,
  createRespuesta,
  deleteRespuesta,
  updateRespuesta
};