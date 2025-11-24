const mysql = require('mysql2/promise');

async function checkBalances() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'tayacoins'
    });

    const [rows] = await connection.execute('SELECT id, name, balance FROM users WHERE id IN (15, 17)');
    console.log('User balances:');
    rows.forEach(u => console.log(`  ${u.name} (ID ${u.id}): ${u.balance} TC`));

    await connection.end();
}

checkBalances();
