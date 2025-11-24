const mysql = require('mysql2/promise');

async function clearDatabase() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'tayacoins'
    });

    try {
        console.log('🗑️  Limpiando base de datos...\n');

        // Disable foreign key checks temporarily
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

        // Delete all data from tables (in order to respect foreign keys)
        console.log('Eliminando reseñas...');
        const [reviews] = await connection.execute('DELETE FROM reviews');
        console.log(`✅ ${reviews.affectedRows} reseñas eliminadas`);

        console.log('Eliminando transacciones...');
        const [transactions] = await connection.execute('DELETE FROM transactions');
        console.log(`✅ ${transactions.affectedRows} transacciones eliminadas`);

        console.log('Eliminando productos...');
        const [products] = await connection.execute('DELETE FROM products');
        console.log(`✅ ${products.affectedRows} productos eliminados`);

        console.log('Eliminando usuarios...');
        const [users] = await connection.execute('DELETE FROM users');
        console.log(`✅ ${users.affectedRows} usuarios eliminados`);

        // Reset auto-increment counters
        await connection.execute('ALTER TABLE reviews AUTO_INCREMENT = 1');
        await connection.execute('ALTER TABLE transactions AUTO_INCREMENT = 1');
        await connection.execute('ALTER TABLE products AUTO_INCREMENT = 1');
        await connection.execute('ALTER TABLE users AUTO_INCREMENT = 1');

        // Re-enable foreign key checks
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

        console.log('\n✨ Base de datos limpiada exitosamente!');
        console.log('Los contadores de ID se han reiniciado a 1.');

    } catch (error) {
        console.error('❌ Error limpiando base de datos:', error.message);
    } finally {
        await connection.end();
    }
}

clearDatabase();
