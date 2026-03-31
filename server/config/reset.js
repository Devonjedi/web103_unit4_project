import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import { pool } from './database.js'

const createTables = async () => {
    try {
        await pool.query(`
            DROP TABLE IF EXISTS custom_cars;

            CREATE TABLE custom_cars (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                exterior_color VARCHAR(50) NOT NULL,
                wheel_type VARCHAR(50) NOT NULL,
                interior VARCHAR(50) NOT NULL,
                engine VARCHAR(50) NOT NULL,
                total_price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `)
        console.log('Tables created successfully')
    } catch (err) {
        console.error('Error creating tables:', err)
    } finally {
        pool.end()
    }
}

createTables()
