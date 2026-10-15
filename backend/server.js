require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken, verifyAdmin } = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Database Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Pass the database pool to the request object so routes can access it
app.use((req, res, next) => {
    req.db = pool;
    next();
});

// --- ROUTES ---

// 1. Public Endpoint: Get all active offers
app.get('/api/offers', async (req, res) => {
    try {
        const [rows] = await req.db.query('SELECT * FROM offers WHERE is_active = TRUE');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching offers' });
    }
});

// 2. Customer Endpoint: Submit a new commission request
app.post('/api/commissions', async (req, res) => {
    // In a real app, customer_id would come from the verified JWT token
    const { customer_id, offer_id, custom_requirements } = req.body;

    try {
        const [result] = await req.db.query(
            'INSERT INTO commissions (customer_id, offer_id, custom_requirements) VALUES (?, ?, ?)',
            [customer_id, offer_id, custom_requirements]
        );
        res.status(201).json({ message: 'Commission requested successfully', orderId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create commission request' });
    }
});

// 3. Admin Endpoint: Update an existing offer (Protected in a real app)
app.put('/api/admin/offers/:id', verifyAdmin, async (req, res) => {
    const offerId = req.params.id;
    const { title, description, base_price, is_active } = req.body;

    // ... (rest of the update logic remains the same)
    try {
        const [result] = await req.db.query(
            'UPDATE offers SET title = ?, description = ?, base_price = ?, is_active = ? WHERE id = ?',
            [title, description, base_price, is_active, offerId]
        );
        // ...
    } catch (error) {
        // ...
    }
});
// 4. Auth Endpoint: Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user in the database
        const [users] = await req.db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 2. Compare the provided password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 3. Generate the JWT Token (valid for 24 hours)
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});