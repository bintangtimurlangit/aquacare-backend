const feedingService = require('../services/feedingService');

class FeedingController {
    async createSchedule(req, res) {
        try {
            const { deviceId } = req.params;
            const userId = req.user.userId;
            const { time, days } = req.body;

            if (!time || !days || !Array.isArray(days)) {
                return res.status(400).json({ 
                    error: 'Time and days array are required' 
                });
            }

            const schedule = await feedingService.createSchedule(
                userId, 
                deviceId, 
                time, 
                days
            );
            res.status(201).json({ schedule });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getSchedules(req, res) {
        try {
            const { deviceId } = req.params;
            const userId = req.user.userId;

            const schedules = await feedingService.getSchedules(userId, deviceId);
            res.json({ schedules });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async triggerFeeding(req, res) {
        try {
            const { deviceId } = req.params;
            const userId = req.user.userId;

            await feedingService.triggerManualFeeding(userId, deviceId);
            res.json({ message: 'Feeding triggered successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getFeedingHistory(req, res) {
        try {
            const { deviceId } = req.params;
            const userId = req.user.userId;

            const history = await feedingService.getFeedingHistory(userId, deviceId);
            res.json({ history });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new FeedingController();