const pool = require('../db');

// Obtener las Opciones (incluye enunciado de la pregunta)
const getAllOpcion = async (req, res, next) => {
    try {
        const allOpcion = await pool.query(`
            SELECT 
                o.id_opcion,
                o.id_insiso,
                o.contenido,
                o.estado,
                p.enunciado AS enunciado_pregunta
            FROM opcion o
            INNER JOIN pregunta p ON o.id_pregunta = p.id_pregunta
            WHERE o.estado = 'Habilitado'
              AND p.estado = 'Habilitado'
        `);

        res.json(allOpcion.rows);
    } catch (error) {
        next(error);
    }
};

// Obtener una Opción (con enunciado)
const getOpcion = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT 
                o.id_opcion,
                o.id_insiso,
                o.contenido,
                o.estado,
                p.enunciado AS enunciado_pregunta
            FROM opcion o
            INNER JOIN pregunta p ON o.id_pregunta = p.id_pregunta
            WHERE o.id_opcion = $1
              AND o.estado = 'Habilitado'
              AND p.estado = 'Habilitado'
        `, [id]);

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Opcion no encontrado" });

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// Crear una Opción
const createOpcion = async (req, res, next) => {
  // 1. ELIMINAR nombre_tutoria de la desestructuración de req.body
  const { enunciado, id_insiso, contenido } = req.body; 
  // **IMPORTANTE:** Si tu frontend ahora envía id_pregunta, desestructúralo aquí:
  // const { id_pregunta, id_insiso, contenido } = req.body;
  
  // Usaremos el id_pregunta de la desestructuración si lo envías,
  // pero mantendremos la lógica original de buscarlo por `enunciado` para fines de corrección.

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // -------------------------------------------------------------------------
    // --- Lógica ORIGINAL: Buscar tutoría (ELIMINADA) --------------------------
    // -------------------------------------------------------------------------
    
    // **ASUNCIÓN CLAVE:** Ahora buscamos la pregunta directamente solo por su enunciado
    // o el frontend nos proporciona el `id_pregunta` directamente. 
    // Si la pregunta no es única por su enunciado, este método podría fallar.
    
    // Si el frontend NO envía el id_pregunta, buscamos el id_pregunta usando el enunciado:
    const preguntaResult = await client.query(
      `SELECT id_pregunta 
       FROM pregunta 
       WHERE enunciado = $1 
         AND estado = 'Habilitado'`,
      [enunciado] // Ya no se necesita id_tutoria aquí
    );

    if (preguntaResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: `No se encontró la pregunta "${enunciado}" o está deshabilitada.`,
      });
    }

    const id_pregunta = preguntaResult.rows[0].id_pregunta;
    // -------------------------------------------------------------------------
    
    // Verificar que no exista el mismo inciso
    const existeInciso = await client.query(
      `SELECT 1 
       FROM opcion 
       WHERE id_pregunta = $1 AND LOWER(TRIM(id_insiso)) = LOWER(TRIM($2)) 
         AND estado = 'Habilitado'`,
      [id_pregunta, id_insiso]
    );

    if (existeInciso.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        message: `El inciso "${id_insiso}" ya existe en esta pregunta.`,
      });
    }

    // Crear la opción
    const opcionResult = await client.query(
      `INSERT INTO opcion (id_pregunta, id_insiso, contenido, estado)
       VALUES ($1, $2, $3, 'Habilitado')
       RETURNING *`,
      [id_pregunta, id_insiso, contenido]
    );

    await client.query('COMMIT');
    return res.status(201).json({
      message: 'Opción creada correctamente.',
      opcion: opcionResult.rows[0],
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear la opción:', error);
    next(error);
  } finally {
    client.release();
  }
};

// Eliminar una opción
const deleteOpcion = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "UPDATE opcion SET estado = 'Deshabilitado' WHERE id_opcion = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Opcion no encontrado" });
        }

        return res.status(200).json({ message: "Opcion deshabilitado correctamente" });
    } catch (error) {
        next(error);
    }
};

// Actualizar una opción (usando el enunciado, no id_pregunta)
const updateOpcion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { enunciado, id_insiso, contenido } = req.body;

        // Buscar el id_pregunta por enunciado
        const preguntaResult = await pool.query(
            `SELECT id_pregunta FROM pregunta WHERE enunciado = $1 AND estado = 'Habilitado'`,
            [enunciado]
        );

        if (preguntaResult.rows.length === 0) {
            return res.status(404).json({
                message: `No existe una pregunta con el enunciado "${enunciado}".`
            });
        }

        const id_pregunta = preguntaResult.rows[0].id_pregunta;

        const result = await pool.query(
            `UPDATE opcion 
            SET id_pregunta = $1, id_insiso = $2, contenido = $3
            WHERE id_opcion = $4
            RETURNING *`,
            [id_pregunta, id_insiso, contenido, id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Opcion no encontrado" });

        return res.json(result.rows[0]);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllOpcion,
    getOpcion,
    createOpcion,
    deleteOpcion,
    updateOpcion
};
