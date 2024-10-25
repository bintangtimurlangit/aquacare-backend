const express = require('express');
const { checkUserDevices, addDevice } = require('../controllers/deviceController');
const authMiddleware = require('../middlewares/authMiddleware'); // to check if the user is authenticated

const router = express.Router();

router.get('/user-devices', authMiddleware, checkUserDevices);
router.post('/add', authMiddleware, addDevice); // Add this line to handle adding a device

module.exports = router;