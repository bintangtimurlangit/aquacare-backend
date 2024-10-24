const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    console.log('Raw Authorization Header:', token);

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    const bearerToken = token.split(' ')[1];

    try {
        const decoded = jwt.verify(bearerToken, secretKey);
        req.user = {
            id: decoded.userId,
            username: decoded.username,
        };

        console.log('Decoded User ID:', req.user.id);
        console.log('Decoded Username:', req.user.username);

        next();
    } catch (err) {
        console.error('JWT Verification Error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = authMiddleware;
