const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.checkUserDevices = async (req, res) => {
    const userId = req.user.id;

    try {
        const userDevices = await prisma.devices.findMany({
            where: { user_id: userId },
            select: { token: true, aquarium_name: true }
        });

        if (userDevices.length === 0) {
            return res.status(404).json({ message: 'No devices found' });
        }

        res.status(200).json({ devices: userDevices });
    } catch (error) {
        console.error('Error fetching user devices:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
