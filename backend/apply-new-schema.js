const mysql = require('mysql2/promise');

async function applyNewSchema() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'tayacoins'
    });

    try {
        console.log('Applying new schema changes...');
        await connection.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Otros'");
        await connection.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS cover_image TEXT");
        console.log('✅ New columns added successfully!');
    } catch (error) {
        console.error('Error updating schema:', error.message);
    } finally {
        await connection.end();
    }
}

applyNewSchema();
