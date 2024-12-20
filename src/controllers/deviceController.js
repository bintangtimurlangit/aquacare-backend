const { PrismaClient } = require('@prisma/client');
const DEFAULT_FEEDING_SCHEDULE = require('../config/defaultSchedule');

const prisma = new PrismaClient();

class DeviceController {
  async registerDevice(req, res) {
    try {
      const userId = req.user.userId; // From auth middleware
      const { deviceId, name } = req.body;

      // Create device with default schedules in a transaction
      const device = await prisma.$transaction(async (tx) => {
        // Create the device
        const newDevice = await tx.device.create({
          data: {
            id: deviceId,
            name,
            userId,
          },
        });

        // Create default feeding schedules
        const schedulePromises = DEFAULT_FEEDING_SCHEDULE.map(schedule => 
          tx.feedingSchedule.create({
            data: {
              deviceId: deviceId,
              time: schedule.time,
              days: schedule.days,
              isActive: schedule.isActive
            }
          })
        );

        await Promise.all(schedulePromises);

        return newDevice;
      });

      // Notify device about new schedules via MQTT
      const mqttTopic = `aquacare/${deviceId}/feeding/schedule/update`;
      global.mqttClient.publish(mqttTopic, JSON.stringify(DEFAULT_FEEDING_SCHEDULE));

      res.status(201).json({
        message: 'Device registered successfully with default schedules',
        device,
      });
    } catch (error) {
      console.error('Error registering device:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getUserDevices(req, res) {
    try {
      const userId = req.user.userId;
      const devices = await deviceService.getUserDevices(userId);

      res.json({ devices });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async controlDevice(req, res) {
    try {
      const { deviceId } = req.params;
      const userId = req.user.userId;

      // Verify device belongs to user
      const device = await deviceService.getUserDevice(userId, deviceId);
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }

      // Publish control message to MQTT
      const mqttTopic = `aquacare/${deviceId}/control`;
      global.mqttClient.publish(mqttTopic, JSON.stringify(req.body));

      res.json({ message: 'Control command sent successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new DeviceController();
