const mysql = require('mysql2/promise');

async function updateSchema() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'tayacoins'
    });

    try {
        console.log('Adding social media columns to users table...');
        await connection.execute('ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT');
        await connection.execute('ALTER TABLE users ADD COLUMN IF NOT EXISTS instagram VARCHAR(255)');
        await connection.execute('ALTER TABLE users ADD COLUMN IF NOT EXISTS facebook VARCHAR(255)');
        await connection.execute('ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter VARCHAR(255)');
        console.log('✅ Schema updated successfully!');
    } catch (error) {
        console.error('Error updating schema:', error.message);
    } finally {
        await connection.end();
    }
}

updateSchema();
