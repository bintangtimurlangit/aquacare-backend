const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class MetricsService {
  async getMetricsHistory(userId, deviceId, startDate, endDate) {
    // Verify device ownership
    await this.verifyDeviceOwnership(userId, deviceId);

    // Convert dates to Date objects
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to last 24 hours
    const end = endDate ? new Date(endDate) : new Date();

    return await prisma.metrics.findMany({
      where: {
        deviceId,
        timestamp: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async getAlertHistory(userId, deviceId) {
    await this.verifyDeviceOwnership(userId, deviceId);

    return await prisma.alert.findMany({
      where: {
        deviceId,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 50, // Last 50 alerts
    });
  }

  async verifyDeviceOwnership(userId, deviceId) {
    const device = await prisma.device.findFirst({
      where: {
        id: deviceId,
        userId,
      },
    });

    if (!device) {
      throw new Error('Device not found or unauthorized');
    }

    return device;
  }
}

module.exports = new MetricsService();
