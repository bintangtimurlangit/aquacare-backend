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
    const userId = req.user.id; // Check that userId is correctly assigned
    const { token, aquarium_name } = req.body;

    try {
        // Create a new device
        const newDevice = await prisma.devices.create({
            data: {
                user_id: userId, // Corrected user_id key to match the schema
                token: token || null,
                aquarium_name: aquarium_name || null
            }
        });

        res.status(201).json({ message: 'Device added successfully', device: newDevice });
    } catch (error) {
        console.error('Error adding device:', error); // Log full error object for better debugging
        res.status(500).json({ error: 'Internal server error' });
    }
};
