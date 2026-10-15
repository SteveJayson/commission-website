// backend/seedAdmin.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        // 1. Connect to the database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // EDIT THESE TWO LINES
        const adminEmail = 'steve@gmail.com';
        const adminPassword = 'hirosama123';

        console.log('Checking for existing admin...');
        const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [adminEmail]);

        if (existing.length > 0) {
            console.log('Admin user already exists. Exiting.');
            process.exit();
        }

        console.log('Hashing password...');
        // 2. Generate a secure hash of your password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        console.log('Inserting admin into database...');
        // 3. Insert the new user with the 'admin' role
        await connection.query(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
            [adminEmail, hashedPassword, 'admin']
        );

        console.log('✅ Admin user created successfully!');
        console.log(`Email: ${adminEmail}`);
        console.log('You can now log into your dashboard.');

        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();