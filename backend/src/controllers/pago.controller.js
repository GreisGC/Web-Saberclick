const pool = require('../db');

// Obtener todos los pagos
const getAllPago = async (req, res, next) => {
    try {
        const allPagos = await pool.query("SELECT * FROM pago WHERE estado != 'Deshabilitado'");
        res.json(allPagos.rows);
    } catch (error) {
        next(error);
    }
};

// Obtener un pago por ID
const getPago = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM pago WHERE id_pago = $1", [id]);

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Pago no encontrado" });

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// Crear un pago manualmente (por ejemplo, cuando el estudiante paga)
const createPago = async (req, res, next) => {
    const { monto, metodo_pago, id_inscripcion } = req.body;

    try {
        // Verificar que la inscripción exista
        const inscripcion = await pool.query(
            "SELECT * FROM inscripcion WHERE id_inscripcion = $1 AND estado = 'Habilitado'",
            [id_inscripcion]
        );

        if (inscripcion.rowCount === 0) {
            return res.status(404).json({ message: "Inscripción no encontrada o deshabilitada" });
        }

        // Crear el registro de pago
        const pagoResult = await pool.query(
            `INSERT INTO pago (monto, metodo_pago, fecha_pago, estado, id_inscripcion)
             VALUES ($1, $2, CURRENT_DATE, 'Pagado', $3)
             RETURNING *`,
            [monto, metodo_pago, id_inscripcion]
        );

        return res.status(201).json({
            message: "Pago registrado correctamente",
            pago: pagoResult.rows[0]
        });

    } catch (error) {
        next(error);
    }
};

// Actualizar el estado de un pago (por ejemplo de "Pendiente" a "Pagado")
const updatePago = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; // puede ser "Pagado", "Pendiente" o "Deshabilitado"

        const result = await pool.query(
            "UPDATE pago SET estado = $1 WHERE id_pago = $2 RETURNING *",
            [estado, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Pago no encontrado" });
        }

        return res.status(200).json({
            message: `Estado de pago actualizado a ${estado}`,
            pago: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// 🗑️ Deshabilitar un pago (eliminación lógica)
const deletePago = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "UPDATE pago SET estado = 'Deshabilitado' WHERE id_pago = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Pago no encontrado" });
        }

        return res.status(200).json({
            message: "Pago deshabilitado correctamente",
            pago: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPago,
    getPago,
    createPago,
    updatePago,
    deletePago
};
