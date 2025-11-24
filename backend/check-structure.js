require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkTableStructure() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Checking transactions table structure...');
        const [rows] = await connection.execute('DESCRIBE transactions');
        console.log(rows);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await connection.end();
    }
}

checkTableStructure();
