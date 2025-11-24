const mysql = require('mysql2/promise');

async function addTiktokColumn() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'tayacoins'
    });

    try {
        console.log('Adding tiktok column...');
        await connection.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS tiktok VARCHAR(255)");
        console.log('✅ Tiktok column added successfully!');
    } catch (error) {
        console.error('Error updating schema:', error.message);
    } finally {
        await connection.end();
    }
}

addTiktokColumn();
