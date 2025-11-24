require('dotenv').config();
const mysql = require('mysql2/promise');

async function addDescriptionColumn() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Adding description column to products table...');
        await connection.execute('ALTER TABLE products ADD COLUMN description TEXT AFTER name');
        console.log('Column added successfully!');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists.');
        } else {
            console.error('Error:', error.message);
        }
    } finally {
        await connection.end();
    }
}

addDescriptionColumn();
