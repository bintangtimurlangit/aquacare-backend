const express = require('express');
const { checkUserDevices } = require('../controllers/deviceController');
const authMiddleware = require('../middlewares/authMiddleware'); // to check if the user is authenticated

const router = express.Router();

router.get('/user-devices', authMiddleware, checkUserDevices);

module.exports = router;