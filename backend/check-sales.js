const mysql = require('mysql2/promise');

async function checkSales() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'tayacoins'
    });

    console.log('Checking user 17 (silva) sales:');
    const [sales] = await connection.execute('SELECT * FROM transactions WHERE seller_id = 17');
    console.log(`Total sales: ${sales.length}`);
    sales.forEach(s => {
        console.log(`  Transaction ${s.id}: Sold to buyer ${s.buyer_id} for ${s.amount} TC`);
    });

    await connection.end();
}

checkSales();
