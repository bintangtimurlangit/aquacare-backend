const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const deviceSettingsController = require('../controllers/deviceSettingsController');
const metricsController = require('../controllers/metricsController');
const authMiddleware = require('../middleware/auth');

// All device routes require authentication
router.use(authMiddleware);

// Register a new device
router.post('/register', deviceController.registerDevice);

// Get user's devices
router.get('/my-devices', deviceController.getUserDevices);

// Control a device
router.post(
  '/:deviceId/control',
  authMiddleware,
  deviceController.controlDevice
);

// New routes for metrics and alerts
router.get('/:deviceId/metrics/history', metricsController.getMetricsHistory);
router.get('/:deviceId/alerts', metricsController.getAlertHistory);

// Device settings routes
router.get('/:deviceId/settings', deviceSettingsController.getSettings);
router.put('/:deviceId/settings', deviceSettingsController.updateSettings);

module.exports = router;
