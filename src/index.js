const express = require('express');
const cors = require('cors');
const http = require('http');
const { initializeSocket } = require('./config/socket');
const setupMQTT = require('./config/mqtt');
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const feedingRoutes = require('./routes/feedingRoutes');
const checkAndCreateDefaultSchedules = require('./jobs/scheduleChecker');

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

// Setup MQTT and make it globally accessible
const mqttClient = setupMQTT(io);
global.mqttClient = mqttClient;

// Run schedule checker on server start
checkAndCreateDefaultSchedules();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'aquacare-api',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api', feedingRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
