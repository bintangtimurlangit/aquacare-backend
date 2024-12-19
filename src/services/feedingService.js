const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class FeedingService {
  async createSchedule(userId, deviceId, time, days) {
    // Verify device belongs to user
    const device = await this.verifyDeviceOwnership(userId, deviceId);

    // Validate days (1-7)
    const validDays = days.every(
      day => parseInt(day) >= 1 && parseInt(day) <= 7
    );
    if (!validDays) {
      throw new Error('Days must be between 1 (Monday) and 7 (Sunday)');
    }

    return await prisma.feedingSchedule.create({
      data: {
        deviceId,
        time,
        days: days.join(','), // Store as comma-separated string
      },
    });
  }

  async getSchedules(userId, deviceId) {
    await this.verifyDeviceOwnership(userId, deviceId);

    const schedules = await prisma.feedingSchedule.findMany({
      where: {
        deviceId,
        isActive: true,
      },
    });

    // Transform days string back to array
    return schedules.map(schedule => ({
      ...schedule,
      days: schedule.days.split(','),
    }));
  }

  async triggerManualFeeding(userId, deviceId) {
    await this.verifyDeviceOwnership(userId, deviceId);

    // Send MQTT command to device
    global.mqttClient.publish(
      `aquacare/${deviceId}/control`,
      JSON.stringify({
        command: 'feed',
      })
    );

    // Record in feeding history
    return await prisma.feedingHistory.create({
      data: {
        deviceId,
        type: 'manual',
      },
    });
  }

  async getFeedingHistory(userId, deviceId) {
    await this.verifyDeviceOwnership(userId, deviceId);

    return await prisma.feedingHistory.findMany({
      where: {
        deviceId,
      },
      orderBy: {
        feedTime: 'desc',
      },
      take: 10, // Last 10 feeding events
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

module.exports = new FeedingService();
