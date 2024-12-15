const deviceService = require('../services/deviceService');

class DeviceController {
    async registerDevice(req, res) {
        try {
            const userId = req.user.userId; // From auth middleware
            const { deviceId, name } = req.body;
            
            const device = await deviceService.registerDevice(userId, deviceId, name);
            
            res.status(201).json({
                message: 'Device registered successfully',
                device
            });
        } catch (error) {
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