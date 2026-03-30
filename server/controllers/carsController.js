import { pool } from '../config/database.js'

export const getAllCars = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM custom_cars ORDER BY created_at DESC'
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch cars' })
    }
}

export const getCarById = async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query(
            'SELECT * FROM custom_cars WHERE id = $1',
            [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' })
        }
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch car' })
    }
}

export const createCar = async (req, res) => {
    try {
        const { name, exterior_color, wheel_type, interior, engine, total_price } = req.body

        // Validate impossible combination: electric engine + off-road wheels
        if (engine === 'electric' && wheel_type === 'off-road') {
            return res.status(400).json({
                error: 'Electric engines are not compatible with off-road wheels.'
            })
        }

        const result = await pool.query(
            `INSERT INTO custom_cars (name, exterior_color, wheel_type, interior, engine, total_price)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [name, exterior_color, wheel_type, interior, engine, total_price]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create car' })
    }
}

export const updateCar = async (req, res) => {
    try {
        const { id } = req.params
        const { name, exterior_color, wheel_type, interior, engine, total_price } = req.body

        // Validate impossible combination: electric engine + off-road wheels
        if (engine === 'electric' && wheel_type === 'off-road') {
            return res.status(400).json({
                error: 'Electric engines are not compatible with off-road wheels.'
            })
        }

        const result = await pool.query(
            `UPDATE custom_cars
             SET name = $1, exterior_color = $2, wheel_type = $3, interior = $4, engine = $5, total_price = $6
             WHERE id = $7
             RETURNING *`,
            [name, exterior_color, wheel_type, interior, engine, total_price, id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' })
        }
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to update car' })
    }
}

export const deleteCar = async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query(
            'DELETE FROM custom_cars WHERE id = $1 RETURNING *',
            [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' })
        }
        res.json({ message: 'Car deleted successfully', car: result.rows[0] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to delete car' })
    }
}
