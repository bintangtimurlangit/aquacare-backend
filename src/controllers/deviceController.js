const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.checkUserDevices = async (req, res) => {
    const userId = req.user.id;

    try {
        const userDevices = await prisma.devices.findMany({
            where: { user_id: userId },
            select: { token: true, aquarium_name: true }
        });

        res.status(200).json({ devices: userDevices });
    } catch (error) {
        console.error('Error fetching user devices:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addDevice = async (req, res) => {
    const userId = req.user.userId; // Extract user ID from the request
    const { token, aquarium_name } = req.body; // Extract token and aquarium_name from the request body

    try {
        // Create a new device
        const newDevice = await prisma.devices.create({
            data: {
                user_id: userId, // Store the user ID
                token: token || null, // Store the token or null if not provided
                aquarium_name: aquarium_name || null // Store the aquarium name or null if not provided
            }
        });

        res.status(201).json({ message: 'Device added successfully', device: newDevice });
    } catch (error) {
        console.error('Error adding device:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};