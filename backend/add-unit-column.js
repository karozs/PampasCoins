const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tayacoins'
};

async function addUnitColumn() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Check if column exists
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products' AND COLUMN_NAME = 'unit'
        `, [dbConfig.database]);

        if (columns.length > 0) {
            console.log('Column "unit" already exists in "products" table.');
        } else {
            console.log('Adding "unit" column to "products" table...');
            await connection.execute(`
                ALTER TABLE products 
                ADD COLUMN unit VARCHAR(20) DEFAULT 'unidades' AFTER quantity
            `);
            console.log('Column "unit" added successfully.');
        }

    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addUnitColumn();
