const mysql = require('mysql2/promise');

async function verifyDatabase() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'tayacoins'
    });

    try {
        console.log('📊 Verificando estado de la base de datos...\n');

        const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
        console.log(`👥 Usuarios: ${users[0].count}`);

        const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
        console.log(`📦 Productos: ${products[0].count}`);

        const [transactions] = await connection.execute('SELECT COUNT(*) as count FROM transactions');
        console.log(`💰 Transacciones: ${transactions[0].count}`);

        const [reviews] = await connection.execute('SELECT COUNT(*) as count FROM reviews');
        console.log(`⭐ Reseñas: ${reviews[0].count}`);

        console.log('\n✅ Base de datos lista para usar!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

verifyDatabase();
