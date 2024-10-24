const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

const secretKey = process.env.JWT_SECRET;

// Register user
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await prisma.users.findUnique({
            where: { username },
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await prisma.users.create({
            data: {
                username,
                password: hashedPassword,
                created_at: new Date(),
            },
        });

        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login user
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: { username },
        });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, {
            expiresIn: '1h',
        });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};