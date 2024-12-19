const metricsService = require('../services/metricsService');

class MetricsController {
  async getMetricsHistory(req, res) {
    try {
      const { deviceId } = req.params;
      const { startDate, endDate } = req.query;
      const userId = req.user.userId;

      const metrics = await metricsService.getMetricsHistory(
        userId,
        deviceId,
        startDate,
        endDate
      );

      res.json({ metrics });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAlertHistory(req, res) {
    try {
      const { deviceId } = req.params;
      const userId = req.user.userId;

      const alerts = await metricsService.getAlertHistory(userId, deviceId);
      res.json({ alerts });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new MetricsController();
