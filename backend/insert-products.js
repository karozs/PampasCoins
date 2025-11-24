const mysql = require('mysql2/promise');

async function insertProducts() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'tayacoins'
    });

    try {
        console.log('Conectado a la base de datos...');

        // Productos de Frutas
        const frutas = [
            [6, 'Fresas Frescas', 10, 45, 'available'],
            [7, 'Plátanos Orgánicos', 15, 25, 'available'],
            [6, 'Uvas Verdes', 8, 60, 'available'],
            [7, 'Sandía Grande', 5, 80, 'available'],
            [6, 'Melón Amarillo', 7, 55, 'available'],
            [7, 'Piña Tropical', 12, 40, 'available'],
            [6, 'Kiwis Importados', 20, 35, 'available'],
            [7, 'Mangos Maduros', 10, 50, 'available']
        ];

        // Productos de Verduras
        const verduras = [
            [6, 'Zanahorias Orgánicas', 25, 20, 'available'],
            [7, 'Brócoli Fresco', 15, 30, 'available'],
            [6, 'Espinacas Baby', 10, 35, 'available'],
            [7, 'Pimientos Rojos', 12, 28, 'available'],
            [6, 'Cebollas Moradas', 20, 15, 'available'],
            [7, 'Ajos Frescos', 30, 12, 'available'],
            [6, 'Calabazas', 8, 40, 'available']
        ];

        // Productos Lácteos
        const lacteos = [
            [7, 'Queso Fresco Artesanal', 5, 120, 'available'],
            [6, 'Yogurt Natural', 15, 25, 'available'],
            [7, 'Mantequilla Casera', 10, 45, 'available'],
            [6, 'Leche de Cabra', 8, 35, 'available']
        ];

        // Productos de Panadería
        const panaderia = [
            [7, 'Pan Integral', 20, 18, 'available'],
            [6, 'Galletas de Avena', 25, 22, 'available'],
            [7, 'Croissants Artesanales', 12, 30, 'available']
        ];

        // Productos Varios
        const varios = [
            [6, 'Miel de Abeja Pura', 10, 90, 'available'],
            [7, 'Mermelada de Fresa', 15, 35, 'available'],
            [6, 'Aceite de Oliva Extra Virgen', 8, 150, 'available'],
            [7, 'Café Orgánico Molido', 12, 75, 'available'],
            [6, 'Té Verde Premium', 20, 40, 'available'],
            [7, 'Chocolate Artesanal', 15, 55, 'available']
        ];

        // Combinar todos los productos
        const allProducts = [...frutas, ...verduras, ...lacteos, ...panaderia, ...varios];

        // Insertar productos
        const query = 'INSERT INTO products (seller_id, name, quantity, price, status) VALUES (?, ?, ?, ?, ?)';

        let inserted = 0;
        for (const product of allProducts) {
            try {
                await connection.execute(query, product);
                inserted++;
                console.log(`✓ Insertado: ${product[1]} - ${product[3]} TC`);
            } catch (error) {
                console.error(`✗ Error insertando ${product[1]}:`, error.message);
            }
        }

        console.log(`\n✅ Total de productos insertados: ${inserted}`);

        // Mostrar resumen
        const [rows] = await connection.execute('SELECT COUNT(*) as total FROM products');
        console.log(`📦 Total de productos en la base de datos: ${rows[0].total}`);

        // Mostrar últimos 10 productos
        const [latest] = await connection.execute(
            'SELECT id, name, price, seller_id FROM products ORDER BY created_at DESC LIMIT 10'
        );
        console.log('\n📋 Últimos 10 productos:');
        latest.forEach(p => {
            console.log(`   ${p.id}. ${p.name} - ${p.price} TC (Vendedor: ${p.seller_id})`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await connection.end();
        console.log('\n🔌 Conexión cerrada');
    }
}

insertProducts();
