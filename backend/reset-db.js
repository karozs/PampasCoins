const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetDB() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'tayacoins',
        multipleStatements: true
    });

    try {
        await connection.query('DELETE FROM transactions');
        await connection.query('DELETE FROM products');
        await connection.query('DELETE FROM users');
        console.log('Database reset successfully!');
    } catch (error) {
        console.error('Error resetting database:', error);
    } finally {
        await connection.end();
    }
}

resetDB();
