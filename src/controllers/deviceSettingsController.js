const deviceSettingsService = require('../services/deviceSettingsService');

class DeviceSettingsController {
  async updateSettings(req, res) {
    try {
      const { deviceId } = req.params;
      const userId = req.user.userId;
      const settings = req.body;

      const updatedDevice = await deviceSettingsService.updateSettings(
        userId,
        deviceId,
        settings
      );

      res.json({ device: updatedDevice });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getSettings(req, res) {
    try {
      const { deviceId } = req.params;
      const userId = req.user.userId;

      const settings = await deviceSettingsService.getSettings(
        userId,
        deviceId
      );
      res.json({ settings });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new DeviceSettingsController();
