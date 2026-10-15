// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Check if the Authorization header exists
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ error: 'No token provided, access denied' });
    }

    // 2. Extract the token (Format usually is "Bearer <token>")
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'Malformed token, access denied' });
    }

    // 3. Verify the token using your secret key
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user payload to the request
        next(); // Move to the actual route handler
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Optional: Middleware to ensure the user is an admin
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Admin privileges required' });
        }
    });
};

module.exports = { verifyToken, verifyAdmin };