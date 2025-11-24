require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkProductsStructure() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Checking products table structure...');
        const [rows] = await connection.execute('DESCRIBE products');
        console.log(rows);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await connection.end();
    }
}

checkProductsStructure();
