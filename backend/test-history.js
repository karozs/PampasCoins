require('dotenv').config();
const mysql = require('mysql2/promise');

async function testHistoryQuery() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Testing history query...');
        const [rows] = await connection.execute(`
            SELECT 
                t.*,
                p.name as product_name,
                buyer.name as buyer_name,
                seller.name as seller_name
            FROM transactions t
            JOIN products p ON t.product_id = p.id
            JOIN users buyer ON t.buyer_id = buyer.id
            JOIN users seller ON t.seller_id = seller.id
            WHERE t.buyer_id = ? OR t.seller_id = ?
            ORDER BY t.created_at DESC
        `, [15, 15]);

        console.log('Query successful!');
        console.log('Results:', rows);
    } catch (error) {
        console.error('Error:', error.message);
        console.error('SQL State:', error.sqlState);
        console.error('SQL Message:', error.sqlMessage);
    } finally {
        await connection.end();
    }
}

testHistoryQuery();
