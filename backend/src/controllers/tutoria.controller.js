const pool = require("../db");

// Obtener todas las Tutorias
const getAllTutoria = async (req, res, next) => {
	try {
		const allTutoria = await pool.query(
			"SELECT * FROM tutoria WHERE estado = 'Habilitado'"
		);
		res.json(allTutoria.rows);
	} catch (error) {
		next(error);
	}
};

// Obtener un Tutoria por ID
const getTutoria = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			"SELECT * FROM tutoria WHERE id_tutoria = $1 AND estado = 'Habilitado'",
			[id]
		);

		if (result.rows.length === 0)
			return res.status(404).json({ message: "Tutoria no encontrado" });

		const tutoria = {
			id_tutoria: result.rows[0].id_tutoria,
			nombre_tutoria: result.rows[0].nombre_tutoria,
			descripcion: result.rows[0].descripcion,
			costo: Number(result.rows[0].costo),
			id_institucion: result.rows[0].id_institucion,
			estado: result.rows[0].estado,
		};
		res.json(tutoria);
	} catch (error) {
		next(error);
	}
};

const getTutoriaPorInstitucion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM tutoria WHERE id_institucion = $1 AND estado = 'Habilitado'", [id]);

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Tutoria no encontrado" });

        res.json(result.rows??[]);// Devuelve un array vacio
    } catch (error) {
        next(error);
    }
};

//Crear Tutoria
const createTutoria = async (req, res, next) => {
	const client = await pool.connect();
	try {
		const { costo, nombre_tutoria, descripcion, nombre_institucion } =
			req.body;

		await client.query("BEGIN"); // Iniciar transacción

		// 🔍 Verificar que exista la institución y esté habilitada
		const institucionResult = await client.query(
			`SELECT id_institucion 
       FROM institucion 
       WHERE nombre_institucion = $1 AND estado = 'Habilitado'`,
			[nombre_institucion]
		);

		if (institucionResult.rows.length === 0) {
			await client.query("ROLLBACK");
			return res
				.status(404)
				.json({ message: "Institución no encontrada o deshabilitada" });
		}

		const id_institucion = institucionResult.rows[0].id_institucion;

		// 🚫 Verificar si ya existe una tutoría con el mismo nombre
		const tutoriaExistente = await client.query(
			`SELECT id_tutoria 
       FROM tutoria 
       WHERE nombre_tutoria = $1`,
			[nombre_tutoria]
		);

		if (tutoriaExistente.rows.length > 0) {
			await client.query("ROLLBACK");
			return res
				.status(400)
				.json({ message: "Ya existe una tutoría con ese nombre" });
		}

		// Crear la nueva tutoría asociada a la institución
		const tutoriaResult = await client.query(
			`INSERT INTO tutoria (costo, nombre_tutoria, descripcion, id_institucion)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
			[costo, nombre_tutoria, descripcion, id_institucion]
		);

		await client.query("COMMIT");

		res.status(201).json({
			message: "Tutoría creada correctamente",
			tutoria: tutoriaResult.rows[0],
		});
	} catch (error) {
		await client.query("ROLLBACK");
		console.error("Error al crear tutoría:", error);
		next(error);
	} finally {
		client.release();
	}
};

// Eliminar Tutoria
const deleteTutoria = async (req, res, next) => {
	const client = await pool.connect();

	try {
		const { id } = req.params;

		await client.query("BEGIN"); // Inicia transacción

		// Deshabilitar la tutoría
		const tutoriaResult = await client.query(
			`UPDATE tutoria 
       SET estado = 'Deshabilitado' 
       WHERE id_tutoria = $1 
       RETURNING *`,
			[id]
		);

		if (tutoriaResult.rowCount === 0) {
			await client.query("ROLLBACK");
			return res.status(404).json({ message: "Tutoría no encontrada" });
		}

		//Deshabilitar los paralelos asociados a la tutoría
		await client.query(
			`UPDATE paralelo 
       SET estado = 'Deshabilitado' 
       WHERE id_tutoria = $1`,
			[id]
		);

		//Deshabilitar los temas asociados a la tutoría
		await client.query(
			`UPDATE tema 
       SET estado = 'Deshabilitado' 
       WHERE id_tutoria = $1`,
			[id]
		);

		//Obtener todas las preguntas asociadas a esta tutoría
		const preguntaResult = await client.query(
			`SELECT id_pregunta FROM pregunta WHERE id_tutoria = $1`,
			[id]
		);

		const preguntas = preguntaResult.rows.map((row) => row.id_pregunta);

		//Deshabilitar las preguntas asociadas
		await client.query(
			`UPDATE pregunta 
       SET estado = 'Deshabilitado' 
       WHERE id_tutoria = $1`,
			[id]
		);

		//Deshabilitar las opciones asociadas a esas preguntas (si existen)
		if (preguntas.length > 0) {
			await client.query(
				`UPDATE opcion 
         SET estado = 'Deshabilitado' 
         WHERE id_pregunta = ANY($1::int[])`,
				[preguntas]
			);
		}

		await client.query("COMMIT"); // Finaliza transacción

		res.status(200).json({
			message:
				"Tutoría y todas sus entidades relacionadas deshabilitadas correctamente",
			tutoria: tutoriaResult.rows[0],
		});
	} catch (error) {
		await client.query("ROLLBACK");
		console.error("Error al deshabilitar tutoría:", error);
		next(error);
	} finally {
		client.release();
	}
};

// Actualizar una tutoria
const updateTutoria = async (req, res, next) => {
	try {
		const { id } = req.params;

		const { costo, nombre_tutoria, descripcion } = req.body;

		const result = await pool.query(
			`UPDATE tutoria 
            SET costo = $1, nombre_tutoria = $2, descripcion = $3
            WHERE id_tutoria = $4
            RETURNING *`,
			[costo, nombre_tutoria, descripcion, id]
		);

		if (result.rows.length === 0)
			return res.status(404).json({ message: "Tutoria no encontrado" });

		return res.json(result.rows[0]);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllTutoria,
	getTutoria,
    getTutoriaPorInstitucion,
	createTutoria,
	deleteTutoria,
	updateTutoria,
};
