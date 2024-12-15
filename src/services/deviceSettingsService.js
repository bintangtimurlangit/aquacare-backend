const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class DeviceSettingsService {
    async updateSettings(userId, deviceId, settings) {
        // Verify device ownership
        await this.verifyDeviceOwnership(userId, deviceId);

        // Update or create settings
        return await prisma.deviceSettings.upsert({
            where: {
                deviceId
            },
            update: settings,
            create: {
                deviceId,
                ...settings
            }
        });
    }

    async getSettings(userId, deviceId) {
        await this.verifyDeviceOwnership(userId, deviceId);

        const settings = await prisma.deviceSettings.findUnique({
            where: {
                deviceId
            }
        });

        // Return default settings if none exist
        if (!settings) {
            return {
                phMin: 6.5,
                phMax: 7.5,
                tempMin: 24,
                tempMax: 28,
                waterLevelMin: 80
            };
        }

        return settings;
    }

    async verifyDeviceOwnership(userId, deviceId) {
        const device = await prisma.device.findFirst({
            where: {
                id: deviceId,
                userId
            }
        });

        if (!device) {
            throw new Error('Device not found or unauthorized');
        }

        return device;
    }
}

module.exports = new DeviceSettingsService();