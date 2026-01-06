const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Multer configuration for profile photos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const coverStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'cover-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
    }
});

const uploadCover = multer({
    storage: coverStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
    }
});

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tayacoins',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// User Routes
app.post('/api/register', async (req, res) => {
    const { name, phone, password } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO users (name, phone, password, balance) VALUES (?, ?, ?, 100.00)',
            [name, phone, password]
        );
        res.status(201).json({ id: result.insertId, name, phone, balance: 100.00 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

app.post('/api/login', async (req, res) => {
    const { phone, password } = req.body;
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE phone = ? AND password = ?',
            [phone, password]
        );
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// Update User Profile
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, bio, instagram, facebook, twitter, tiktok } = req.body;

    try {
        await pool.execute(
            'UPDATE users SET name = ?, bio = ?, instagram = ?, facebook = ?, twitter = ?, tiktok = ? WHERE id = ?',
            [name, bio, instagram, facebook, twitter, tiktok, id]
        );

        const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating profile' });
    }
});

// Upload Profile Photo
app.post('/api/users/:id/photo', upload.single('photo'), async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const photoUrl = `/uploads/${req.file.filename}`;

        await pool.execute(
            'UPDATE users SET profile_image = ? WHERE id = ?',
            [photoUrl, id]
        );

        res.json({ profile_image: photoUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading photo' });
    }
});

// Upload Cover Image
app.post('/api/users/:id/cover', uploadCover.single('cover'), async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const coverUrl = `/uploads/${req.file.filename}`;

        await pool.execute(
            'UPDATE users SET cover_image = ? WHERE id = ?',
            [coverUrl, id]
        );

        res.json({ cover_image: coverUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading cover image' });
    }
});

// Social Media Routes
// Get user's social media links
app.get('/api/users/:id/social-media', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM social_media WHERE user_id = ?',
            [req.params.id]
        );

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            // Return empty object if no social media data exists
            res.json({
                user_id: req.params.id,
                instagram: null,
                facebook: null,
                twitter: null,
                tiktok: null,
                whatsapp: null,
                telegram: null
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching social media' });
    }
});

// Create or update user's social media links
app.put('/api/users/:id/social-media', async (req, res) => {
    const { id } = req.params;
    const { instagram, facebook, twitter, tiktok, whatsapp, telegram } = req.body;

    try {
        // Check if record exists
        const [existing] = await pool.execute(
            'SELECT * FROM social_media WHERE user_id = ?',
            [id]
        );

        if (existing.length > 0) {
            // Update existing record
            await pool.execute(
                `UPDATE social_media 
                 SET instagram = ?, facebook = ?, twitter = ?, tiktok = ?, whatsapp = ?, telegram = ?
                 WHERE user_id = ?`,
                [instagram, facebook, twitter, tiktok, whatsapp, telegram, id]
            );
        } else {
            // Insert new record
            await pool.execute(
                `INSERT INTO social_media (user_id, instagram, facebook, twitter, tiktok, whatsapp, telegram)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [id, instagram, facebook, twitter, tiktok, whatsapp, telegram]
            );
        }

        // Return updated data
        const [updated] = await pool.execute(
            'SELECT * FROM social_media WHERE user_id = ?',
            [id]
        );

        res.json(updated[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating social media' });
    }
});

// Product Routes
app.get('/api/products/popular', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                p.id,
                p.name,
                p.price,
                p.image_url,
                COUNT(t.id) as sales
            FROM products p
            JOIN transactions t ON p.id = t.product_id
            GROUP BY p.id
            ORDER BY sales DESC
            LIMIT 5
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching popular products' });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT products.*, users.name as seller_name FROM products JOIN users ON products.seller_id = users.id WHERE status = "available" ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching products' });
    }
});

app.post('/api/products', async (req, res) => {
    const { seller_id, name, description, quantity, price, image_url, category, unit } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO products (seller_id, name, description, quantity, price, image_url, category, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [seller_id, name, description, quantity || 1, price, image_url, category || 'Otros', unit || 'unidades']
        );
        res.status(201).json({ id: result.insertId, message: 'Product created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating product' });
    }
});

app.put('/api/products/:id', async (req, res) => {
    const { name, price, status, unit } = req.body;
    const productId = req.params.id;
    try {
        await pool.execute(
            'UPDATE products SET name = ?, price = ?, status = ?, unit = ? WHERE id = ?',
            [name, price, status, unit, productId]
        );
        res.json({ message: 'Product updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating product' });
    }
});

// Transaction Route (Buy)
app.post('/api/buy', async (req, res) => {
    console.log('=== BUY REQUEST RECEIVED ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    const { buyer_id, product_id, quantity } = req.body;
    const buyQuantity = parseInt(quantity) || 1;

    console.log(`Extracted - buyer_id: ${buyer_id}, product_id: ${product_id}, quantity: ${buyQuantity}`);
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Get product details
        const [products] = await connection.execute('SELECT * FROM products WHERE id = ? FOR UPDATE', [product_id]);
        if (products.length === 0) throw new Error('Product not found');
        const product = products[0];

        if (product.status !== 'available') throw new Error('Product not available');
        if (product.quantity < buyQuantity) throw new Error(`Insufficient stock. Only ${product.quantity} available.`);

        // Get buyer details
        const [buyers] = await connection.execute('SELECT * FROM users WHERE id = ? FOR UPDATE', [buyer_id]);
        if (buyers.length === 0) throw new Error('Buyer not found');
        const buyer = buyers[0];

        const totalPrice = Math.round(parseFloat(product.price) * buyQuantity * 100) / 100;

        console.log(`Processing purchase: Buyer ${buyer_id} (Balance: ${buyer.balance}), Product ${product_id} (Price: ${product.price} x ${buyQuantity} = ${totalPrice})`);

        if (parseFloat(buyer.balance) < totalPrice) throw new Error('Insufficient balance');

        // Update buyer balance
        const [buyerUpdate] = await connection.execute('UPDATE users SET balance = balance - ? WHERE id = ?', [totalPrice, buyer_id]);
        console.log('Buyer balance updated:', buyerUpdate.affectedRows);

        // Update seller balance
        const [sellerUpdate] = await connection.execute('UPDATE users SET balance = balance + ? WHERE id = ?', [totalPrice, product.seller_id]);
        console.log('Seller balance updated:', sellerUpdate.affectedRows);

        // Update product quantity and status
        if (product.quantity > buyQuantity) {
            await connection.execute('UPDATE products SET quantity = quantity - ? WHERE id = ?', [buyQuantity, product_id]);
        } else {
            await connection.execute('UPDATE products SET quantity = 0, status = "sold" WHERE id = ?', [product_id]);
        }

        // Record transaction
        const [txResult] = await connection.execute(
            'INSERT INTO transactions (buyer_id, seller_id, product_id, amount) VALUES (?, ?, ?, ?)',
            [buyer_id, product.seller_id, product_id, totalPrice]
        );
        console.log('Transaction recorded:', txResult.insertId);

        await connection.commit();
        res.json({ message: 'Purchase successful' });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(400).json({ error: error.message });
    } finally {
        connection.release();
    }
});


// Checkout Route (Bulk Buy)
app.post('/api/checkout', async (req, res) => {
    console.log('=== CHECKOUT REQUEST RECEIVED ===');
    const { buyer_id, items } = req.body;
    console.log('Buyer ID:', buyer_id);
    console.log('Items received:', JSON.stringify(items, null, 2));
    console.log('Number of items:', items?.length);

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'No items in cart' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Get buyer details
        const [buyers] = await connection.execute('SELECT * FROM users WHERE id = ? FOR UPDATE', [buyer_id]);
        if (buyers.length === 0) throw new Error('Buyer not found');
        const buyer = buyers[0];
        console.log('Buyer initial balance:', buyer.balance);

        let totalCartPrice = 0;

        // Process each item
        console.log('--- Processing items ---');
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const { product_id, quantity } = item;
            const buyQuantity = parseInt(quantity) || 1;
            console.log(`\nItem ${i + 1}/${items.length}:`);
            console.log('  Product ID:', product_id);
            console.log('  Quantity:', buyQuantity);

            // Get product details
            const [products] = await connection.execute('SELECT * FROM products WHERE id = ? FOR UPDATE', [product_id]);
            if (products.length === 0) throw new Error(`Product ${product_id} not found`);
            const product = products[0];
            console.log('  Product name:', product.name);
            console.log('  Product price:', product.price);

            if (product.status !== 'available') throw new Error(`Product "${product.name}" is no longer available`);
            if (product.quantity < buyQuantity) throw new Error(`Insufficient stock for "${product.name}". Only ${product.quantity} available.`);

            const itemTotalPrice = Math.round(parseFloat(product.price) * buyQuantity * 100) / 100;
            console.log('  Item total price:', itemTotalPrice);
            totalCartPrice += itemTotalPrice;
            console.log('  Running cart total:', totalCartPrice);

            // Update seller balance
            await connection.execute('UPDATE users SET balance = balance + ? WHERE id = ?', [itemTotalPrice, product.seller_id]);
            console.log('  Seller credited:', itemTotalPrice);

            // Update product quantity and status
            if (product.quantity > buyQuantity) {
                await connection.execute('UPDATE products SET quantity = quantity - ? WHERE id = ?', [buyQuantity, product_id]);
            } else {
                await connection.execute('UPDATE products SET quantity = 0, status = "sold" WHERE id = ?', [product_id]);
            }

            // Record transaction
            await connection.execute(
                'INSERT INTO transactions (buyer_id, seller_id, product_id, amount) VALUES (?, ?, ?, ?)',
                [buyer_id, product.seller_id, product_id, itemTotalPrice]
            );
            console.log('  Transaction recorded');
        }

        console.log('\n--- Final calculations ---');
        console.log('Total cart price:', totalCartPrice);
        console.log('Buyer balance:', buyer.balance);

        // Check and deduct buyer balance
        if (parseFloat(buyer.balance) < totalCartPrice) throw new Error('Insufficient balance for total purchase');

        await connection.execute('UPDATE users SET balance = balance - ? WHERE id = ?', [totalCartPrice, buyer_id]);
        console.log('Buyer balance deducted:', totalCartPrice);

        // Fetch updated balance
        const [updatedBuyer] = await connection.execute('SELECT balance FROM users WHERE id = ?', [buyer_id]);
        const newBalance = updatedBuyer[0].balance;
        console.log('New buyer balance:', newBalance);

        await connection.commit();
        console.log('Transaction committed successfully');
        res.json({ message: 'Checkout successful', newBalance });

    } catch (error) {
        await connection.rollback();
        console.error('Checkout error:', error);
        res.status(400).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// History Route
app.get('/api/history/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const [rows] = await pool.execute(`
            SELECT 
                t.*,
                p.name as product_name,
                p.image_url as product_image,
                p.unit as product_unit,
                buyer.name as buyer_name,
                seller.name as seller_name
            FROM transactions t
            LEFT JOIN products p ON t.product_id = p.id
            LEFT JOIN users buyer ON t.buyer_id = buyer.id
            LEFT JOIN users seller ON t.seller_id = seller.id
            WHERE t.buyer_id = ? OR t.seller_id = ?
            ORDER BY t.transaction_date DESC
        `, [userId, userId]);

        res.json(rows || []);
    } catch (error) {
        console.error('History endpoint error:', error);
        res.status(500).json({ error: 'Error fetching transaction history', details: error.message });
    }
});

// Reviews Routes
app.post('/api/reviews', async (req, res) => {
    const { buyer_id, seller_id, rating, comment } = req.body;
    try {
        await pool.execute(
            'INSERT INTO reviews (buyer_id, seller_id, rating, comment) VALUES (?, ?, ?, ?)',
            [buyer_id, seller_id, rating, comment]
        );
        res.status(201).json({ message: 'Review submitted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error submitting review' });
    }
});

app.get('/api/users/:id/reviews', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT r.*, u.name as buyer_name 
            FROM reviews r 
            JOIN users u ON r.buyer_id = u.id 
            WHERE r.seller_id = ? 
            ORDER BY r.created_at DESC
        `, [req.params.id]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
