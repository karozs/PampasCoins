const mysql = require('mysql2/promise');
require('dotenv').config();

async function createSocialMediaTable() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'tayacoins'
    });

    try {
        console.log('Creating social_media table...');

        // Create the social_media table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS social_media (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL UNIQUE,
                instagram VARCHAR(255),
                facebook VARCHAR(255),
                twitter VARCHAR(255),
                tiktok VARCHAR(255),
                whatsapp VARCHAR(20),
                telegram VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        console.log('✓ social_media table created successfully');

        // Migrate existing data from users table
        console.log('Migrating existing social media data...');

        await connection.execute(`
            INSERT INTO social_media (user_id, instagram, facebook, twitter, tiktok)
            SELECT id, instagram, facebook, twitter, tiktok
            FROM users
            WHERE instagram IS NOT NULL 
               OR facebook IS NOT NULL 
               OR twitter IS NOT NULL 
               OR tiktok IS NOT NULL
            ON DUPLICATE KEY UPDATE
                instagram = VALUES(instagram),
                facebook = VALUES(facebook),
                twitter = VALUES(twitter),
                tiktok = VALUES(tiktok)
        `);

        console.log('✓ Data migration completed');

        // Verify the migration
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM social_media');
        console.log(`✓ Total social media records: ${rows[0].count}`);

        console.log('\n✅ Social media table setup completed successfully!');
        console.log('Note: Old columns in users table are kept for backward compatibility.');

    } catch (error) {
        console.error('❌ Error creating social_media table:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

createSocialMediaTable();
