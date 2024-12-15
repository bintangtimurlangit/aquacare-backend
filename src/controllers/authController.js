const authService = require('../services/authService');

class AuthController {
    async register(req, res) {
        try {
            const { user, token } = await authService.register(req.body);
            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                },
                token
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { user, token } = await authService.login(req.body);
            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email
                },
                token
            });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();