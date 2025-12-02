const pool = require('../db');

// Obtener todas las Inscripciones
const getAllInscripcion = async (req, res, next) => {
  try {
    const allPago = await pool.query("SELECT * FROM inscripcion WHERE estado = 'Habilitado'");
    res.json(allPago.rows);
  } catch (error) {
    next(error);
  }
};

// Obtener Inscripcion por ID
const getInscripcion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM inscripcion WHERE id_inscripcion = $1 AND estado = 'Habilitado'",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Inscripción no encontrada" });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
const getAllInscripcionByEstudiante = async (req, res, next) => {
  try {
       const {id_estudiante}=req.params;
    const allPago = await pool.query("SELECT * FROM inscripcion WHERE estado = 'Habilitado' AND id_estudiante = $1",[id_estudiante]);
    res.json(allPago.rows);
  } catch (error) {
    next(error);
  }
};

const getNotasEstudiante = async (req, res, next) => {
  try {
    const { id } = req.params; // Capturamos el ID del estudiante de los parámetros de la ruta

    // 1. Usamos INNER JOIN para unir inscripcion con tutoria por id_tutoria.
    // 2. Usamos WHERE para filtrar por el id_estudiante específico.
    // 3. Seleccionamos las columnas específicas de ambas tablas.
    const query = `
      SELECT
       
        i.id_tutoria,
        i.id_estudiante,
        i.id_paralelo,
        i.fecha_inscripcion,
        i.hora_inscripcion,
        i.nota1,
        i.nota2,
        i.nota3,
        i.intento1,
        i.intento2,
        i.intento3,
        
        t.nombre_tutoria,
        t.costo,
        t.descripcion
        
      FROM 
        inscripcion i 
      INNER JOIN 
        tutoria t ON i.id_tutoria = t.id_tutoria 
      WHERE 
        i.id_estudiante = $1; 
    `;

    // Ejecutamos la consulta, pasando el id_estudiante como parámetro $1
    const allInscripciones = await pool.query(query, [id]);
    
    // Devolvemos el resultado
    res.json(allInscripciones.rows);
  } catch (error) {
    next(error);
  }
};

// Exporta la función para usarla en tus rutas
module.exports = {
    // ... otras funciones
    getNotasEstudiante
};

// Crear Inscripcion con verificaciones completas
const createInscripcion = async (req, res, next) => {
  const {
    fecha_inscripcion,
    hora_inscripcion,
    nota1,
    nota2,
    nota3,
    intento1,
    intento2,
    intento3,
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
    materno_estudiante,
    nombre_tutor,
    paterno_tutor,
    materno_tutor
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // VERIFICACIÓN DE INSTITUCIÓN CORREGIDA:
    // Se usa LOWER(TRIM(...)) para asegurar la coincidencia
    // ignorando espacios iniciales/finales y mayúsculas/minúsculas.
    const inst = await client.query(
      `SELECT id_institucion 
       FROM institucion 
       WHERE LOWER(TRIM(nombre_institucion)) = LOWER(TRIM($1)) AND estado = 'Habilitado'`,
      [nombre_institucion]
    );

    if (inst.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: `Institución "${nombre_institucion}" no encontrada o deshabilitada. (Verifique mayúsculas, minúsculas y espacios).`
      });
    }

    const id_institucion = inst.rows[0].id_institucion;

    //Verificar tutoría dentro de la institución
    const tutoria = await client.query(
      `SELECT id_tutoria, costo 
       FROM tutoria 
       WHERE nombre_tutoria = $1 AND id_institucion = $2 AND estado = 'Habilitado'`,
      [nombre_tutoria, id_institucion]
    );

    if (tutoria.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: `No se encontró la tutoría "${nombre_tutoria}" en la institución "${nombre_institucion}".`
      });
    }

    const { id_tutoria, costo } = tutoria.rows[0];

    // Verificar tutor activo por nombre completo
    const tutor = await client.query(
      `SELECT t.id_tutor
       FROM tutor t
       INNER JOIN usuario u ON t.id_usuario = u.id_usuario
       WHERE u.nombre = $1 AND u.paterno = $2 AND u.materno = $3
         AND u.rol = 'Tutor' AND u.estado = 'Habilitado' AND t.estado = 'Habilitado'`,
      [nombre_tutor, paterno_tutor, materno_tutor]
    );

    if (tutor.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: `El tutor ${nombre_tutor} ${paterno_tutor} ${materno_tutor} no está habilitado.`
      });
    }

    const id_tutor = tutor.rows[0].id_tutor;

   // Verificar que el paralelo exista y pertenezca a esa tutoría
  const paralelo = await client.query(
    `SELECT id_paralelo
    FROM paralelo
    WHERE nombre_paralelo = $1
      AND hora_ini = $2
      AND hora_fin = $3
      AND fecha_ini = $4
      AND fecha_fin = $5
      AND dia = $6
      AND estado = 'Habilitado'`,
    [nombre_paralelo, hora_ini, hora_fin, fecha_ini, fecha_fin, dia]
  );
  
    // VERIFICACIÓN DE EXISTENCIA DE PARALELO:
    if (paralelo.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
            message: `El paralelo con las características especificadas no existe o está deshabilitado.`
        });
    }


    const id_paralelo = paralelo.rows[0].id_paralelo;

    // Verificar estudiante habilitado por nombre completo
    const estudiante = await client.query(
      `SELECT e.id_estudiante
       FROM estudiante e
       INNER JOIN usuario u ON e.id_usuario = u.id_usuario
       WHERE u.nombre = $1 AND u.paterno = $2 AND u.materno = $3
         AND u.rol = 'Estudiante' AND u.estado = 'Habilitado' AND e.estado = 'Habilitado'`,
      [nombre_estudiante, paterno_estudiante, materno_estudiante]
    );

    if (estudiante.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: `El estudiante ${nombre_estudiante} ${paterno_estudiante} ${materno_estudiante} no está habilitado.`
      });
    }

    const id_estudiante = estudiante.rows[0].id_estudiante;

    // Crear la inscripción (solo aquí va el id_estudiante)
    const inscripcion = await client.query(
      `INSERT INTO inscripcion 
      (fecha_inscripcion, hora_inscripcion, nota1, nota2, nota3,intento1, intento2, intento3, id_tutoria, id_paralelo, id_estudiante, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Habilitado')
      RETURNING *`,
      [fecha_inscripcion, hora_inscripcion, nota1, nota2, nota3, intento1,intento2, intento3 , id_tutoria, id_paralelo, id_estudiante]
    );

    const nuevaInscripcion = inscripcion.rows[0];

    // Crear pago asociado
    await client.query(
      `INSERT INTO pago (monto, fecha_pago, estado, id_inscripcion)
       VALUES ($1, CURRENT_DATE, 'Pendiente', $2)`,
      [costo, nuevaInscripcion.id_inscripcion]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      message: 'Inscripción creada correctamente con su pago pendiente.',
      inscripcion: nuevaInscripcion
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en createInscripcion:', error);
    next(error);
  } finally {
    client.release();
  }
};

const createInscripcion2 = async (req, res, next) => {
  const {
    fecha_inscripcion,
    hora_inscripcion,
    nota1,
    nota2,
    nota3,
    intento1,
    intento2,
    intento3,
    id_tutoria,
    id_paralelo,
    id_estudiante
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const getIns=await client.query(`
      SELECT * FROM inscripcion
      WHERE id_tutoria = $1 AND id_paralelo = $2 AND id_estudiante = $3 AND estado='Habilitado'
      `,[id_tutoria,id_paralelo,id_estudiante]);
    
    const oldInscripcion=getIns.rows[0];
    if(oldInscripcion){
      await client.query('COMMIT');
      return res.status(200).json({
        message: 'Inscripción recuperada correctamente.',
        inscripcion: oldInscripcion
      });
    }

    // Crear la inscripción (solo aquí va el id_estudiante)
    const inscripcion = await client.query(
      `INSERT INTO inscripcion 
      (fecha_inscripcion, hora_inscripcion, nota1, nota2, nota3,intento1, intento2, intento3, id_tutoria, id_paralelo, id_estudiante, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Habilitado')
      RETURNING *`,
      [fecha_inscripcion, hora_inscripcion, nota1, nota2, nota3, intento1,intento2, intento3 , id_tutoria, id_paralelo, id_estudiante]
    );

    const nuevaInscripcion = inscripcion.rows[0];

    

    await client.query('COMMIT');

    return res.status(201).json({
      message: 'Inscripción creada correctamente con su pago pendiente.',
      inscripcion: nuevaInscripcion
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en createInscripcion:', error);
    next(error);
  } finally {
    client.release();
  }
};

// Eliminar una Inscripcion (deshabilitar)
const deleteInscripcion = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Iniciamos una transacción para asegurar la consistencia
        await pool.query('BEGIN');

        // Verificar si existe la inscripción
        const inscripcionResult = await pool.query(
            "SELECT * FROM inscripcion WHERE id_inscripcion = $1 AND estado = 'Habilitado'",
            [id]
        );

        if (inscripcionResult.rowCount === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ message: "Inscripción no encontrada o ya deshabilitada" });
        }

        // Deshabilitar pagos asociados
        await pool.query(
            "UPDATE pago SET estado = 'Deshabilitado' WHERE id_inscripcion = $1",
            [id]
        );

        // Deshabilitar respuestas de evaluación asociadas
        await pool.query(
            "UPDATE respuesta_ev SET estado = 'Deshabilitado' WHERE id_inscripcion = $1",
            [id]
        );

        // Deshabilitar la inscripción
        const inscripcionUpdate = await pool.query(
            "UPDATE inscripcion SET estado = 'Deshabilitado' WHERE id_inscripcion = $1 RETURNING *",
            [id]
        );

        // Confirmar la transacción
        await pool.query('COMMIT');

        return res.status(200).json({
            message: "Inscripción, pagos y respuestas de evaluación deshabilitadas correctamente",
            inscripcion: inscripcionUpdate.rows[0]
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        next(error);
    }
};


// Actualizar una Inscripcion
const updateInscripcion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nota1, nota2, nota3, intento1, intento2, intento3 } = req.body;

    // Armamos dinámicamente los campos que se van a actualizar
    const fields = [];
    const values = [];
    let index = 1;

    if (nota1 !== undefined) { fields.push(`nota1 = $${index++}`); values.push(nota1); }
    if (nota2 !== undefined) { fields.push(`nota2 = $${index++}`); values.push(nota2); }
    if (nota3 !== undefined) { fields.push(`nota3 = $${index++}`); values.push(nota3); }
    if (intento1 !== undefined) { fields.push(`intento1 = $${index++}`); values.push(intento1); }
    if (intento2 !== undefined) { fields.push(`intento2 = $${index++}`); values.push(intento2); }
    if (intento3 !== undefined) { fields.push(`intento3 = $${index++}`); values.push(intento3); }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No se proporcionaron campos para actualizar" });
    }

    // Agregamos el id al final
    values.push(id);

    const result = await pool.query(
      `UPDATE inscripcion
       SET ${fields.join(", ")}
       WHERE id_inscripcion = $${index}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Inscripción no encontrada" });

    return res.json({
      message: "Inscripción actualizada correctamente",
      inscripcion: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
};

const updateNroIntento=async (req, res, next)=>{
  try {
    const {id_inscripcion,nota}=req.body;

    const result = await pool.query(
      "SELECT * FROM inscripcion WHERE id_inscripcion = $1 AND estado = 'Habilitado'",
      [id_inscripcion]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Inscripción no encontrada" });

    

    const inscripcion=result.rows[0];

    if(inscripcion.nota1<51 && inscripcion.intento1<3){
      const intento=Number(inscripcion.intento1)+1
      const rr = await pool.query(
        `UPDATE inscripcion 
          SET nota1=$1 , intento1=$2
          WHERE id_inscripcion = $3 AND estado = 'Habilitado'`,
        [nota,intento,id_inscripcion]
      );
      res.json(rr.rows[0]);
      return;
    }else if(inscripcion.nota2<51 && inscripcion.intento2<3){
      const intento=Number(inscripcion.intento2)+1
      const rr = await pool.query(
        `UPDATE inscripcion 
          SET nota2=$1 , intento2=$2
          WHERE id_inscripcion = $3 AND estado = 'Habilitado'`,
        [nota,intento,id_inscripcion]
      );
      res.json(rr.rows[0]);
      return;
    }else if(inscripcion.nota3<51 && inscripcion.intento3<3){
      const intento=Number(inscripcion.intento3)+1
      const rr = await pool.query(
        `UPDATE inscripcion 
          SET nota3=$1 , intento3=$2
          WHERE id_inscripcion = $3 AND estado = 'Habilitado'`,
        [nota,intento,id_inscripcion]
      );
      res.json(rr.rows[0]);
      return;
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getAllInscripcion,
  getInscripcion,
  createInscripcion,
  deleteInscripcion,
  updateInscripcion,
  createInscripcion2,
  updateNroIntento,
  getNotasEstudiante,
  getAllInscripcionByEstudiante
  //getInscripcionCompleta
};