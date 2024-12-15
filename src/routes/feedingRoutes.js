const express = require('express');
const router = express.Router();
const feedingController = require('../controllers/feedingController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Create feeding schedule
router.post('/devices/:deviceId/feeding/schedule', feedingController.createSchedule);

// Get feeding schedules
router.get('/devices/:deviceId/feeding/schedule', feedingController.getSchedules);

// Trigger manual feeding
router.post('/devices/:deviceId/feeding/trigger', feedingController.triggerFeeding);

// Get feeding history
router.get('/devices/:deviceId/feeding/history', feedingController.getFeedingHistory);

module.exports = router;