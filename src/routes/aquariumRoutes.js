const express = require('express');
const aquariumController = require('../controllers/aquariumController');

const router = express.Router();

// Register route
router.post('/register', aquariumController.registerUser);

// Login route
router.post('/login', aquariumController.loginUser);

// Device Status
router.get('/:device_id/status', aquariumController.getDeviceStatus);

// Set Temperature
router.post('/:device_id/temperature', aquariumController.setTemperature);

// Monitor Temperature
router.get('/:device_id/temperature/monitor', aquariumController.monitorTemperature);

// Automatic Temperature Control
router.post('/:device_id/temperature/auto', aquariumController.automaticTemperatureControl);

// Adjust pH
router.post('/:device_id/ph/adjust', aquariumController.adjustPH);

// Monitor pH
router.get('/:device_id/ph', aquariumController.monitorPH);

// Automatic pH Control
router.post('/:device_id/ph/auto', aquariumController.automaticPHControl);

// Refill Water
router.post('/:device_id/water/refill', aquariumController.refillWater);

// Monitor Water Level
router.get('/:device_id/water-level', aquariumController.monitorWaterLevel);

// Automatic Water Refill
router.post('/:device_id/water/auto', aquariumController.automaticWaterRefill);

// Schedule Feeding
router.post('/:device_id/feed/schedule', aquariumController.scheduleFeeding);

// Manual Feed Fish
router.post('/:device_id/feed/manual', aquariumController.manualFeedFish);

// Automatic Feeding
router.post('/:device_id/feed/auto', aquariumController.automaticFeeding);

// Set Monitoring Interval
router.post('/:device_id/monitoring/interval', aquariumController.setMonitoringInterval);

// Get Monitoring Interval
router.get('/:device_id/monitoring/interval', aquariumController.getMonitoringInterval);

// Get All Devices
router.get('/devices', aquariumController.getAllDevices);

// Add New Device
router.post('/add-device', aquariumController.addNewDevice);

// Remove Device
router.delete('/:device_id/remove', aquariumController.removeDevice);

// Log Event
router.post('/:device_id/log', aquariumController.logEvent);

// Get Logs
router.get('/:device_id/logs', aquariumController.getLogs);

// Get Log by ID
router.get('/logs/:log_id', aquariumController.getLogById);

module.exports = router;
