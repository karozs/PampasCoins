require('dotenv').config();
const mysql = require('mysql2/promise');

async function createTestUser() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        // Create test user
        await connection.execute(
            'INSERT INTO users (name, phone, password, balance) VALUES (?, ?, ?, ?)',
            ['Carlos Test', '+34612345678', 'password123', 100]
        );
        console.log('Test user created successfully!');
        console.log('Phone: +34612345678');
        console.log('Password: password123');
    } catch (error) {
        console.error('Error creating test user:', error.message);
    } finally {
        await connection.end();
    }
}

createTestUser();
