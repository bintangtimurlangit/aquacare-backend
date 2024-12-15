const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class DeviceService {
    async registerDevice(userId, deviceId, name) {
        // Check if device already registered
        const existingDevice = await prisma.device.findUnique({
            where: { id: deviceId }
        });

        if (existingDevice) {
            throw new Error('Device already registered');
        }

        // Register device
        const device = await prisma.device.create({
            data: {
                id: deviceId,
                name: name || `Aquarium ${deviceId.slice(0, 6)}`,
                userId
            }
        });

        return device;
    }

    async getUserDevices(userId) {
        return await prisma.device.findMany({
            where: { userId },
            include: {
                metrics: {
                    orderBy: { timestamp: 'desc' },
                    take: 1 // Get latest metrics
                }
            }
        });
    }

    async getUserDevice(userId, deviceId) {
        return await prisma.device.findFirst({
            where: {
                id: deviceId,
                userId: userId
            }
        });
    }
}

module.exports = new DeviceService();