const mqtt = require('mqtt');
const { PrismaClient } = require('@prisma/client');
const { emitMetricsUpdate } = require('./socket');
const alertService = require('../services/alertService');

const prisma = new PrismaClient();
const client = mqtt.connect('mqtt://broker.emqx.io');

function setupMQTT(io) {
  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('aquacare/+/metrics');
  });

  client.on('message', async (topic, message) => {
    const deviceId = topic.split('/')[1];
    const metrics = JSON.parse(message);

    try {
      // Check if device exists and is registered
      const device = await prisma.device.findUnique({
        where: { id: deviceId },
      });

      if (!device) {
        console.log(`Device ${deviceId} not registered to any user`);
        return;
      }

      // Save metrics to database
      const savedMetrics = await prisma.metrics.create({
        data: {
          deviceId,
          ph_level: metrics.metrics.ph_level,
          water_level: metrics.metrics.water_level,
          temperature: metrics.metrics.temperature,
        },
      });

      // Emit real-time update via WebSocket
      emitMetricsUpdate(io, deviceId, savedMetrics);

      console.log(`Metrics saved and broadcast for device ${deviceId}`);

      // Check for alerts
      const deviceSettings = await prisma.deviceSettings.findUnique({
        where: { deviceId },
      });

      // Check for alerts using device settings
      const alerts = await alertService.checkMetrics(
        savedMetrics,
        deviceId,
        deviceSettings
      );

      // Emit metrics update via WebSocket
      emitMetricsUpdate(io, deviceId, savedMetrics);

      // If there are alerts, emit them via WebSocket
      if (alerts.length > 0) {
        // Emit alerts via WebSocket
        io.to(`device_${deviceId}`).emit('alerts', {
          deviceId,
          alerts,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Error processing metrics:', error);
    }
  });

  return client;
}

module.exports = setupMQTT;
