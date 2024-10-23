// const express = require('express');
// const aquariumRoutes = require('./routes/aquariumRoutes'); // Include aquarium routes
// const mqtt = require('mqtt');
// const cors = require('cors'); // Import CORS
// const { PrismaClient } = require('@prisma/client'); // Prisma for database interaction
// require('dotenv').config(); // Load environment variables from .env file
//
// const app = express();
// const prisma = new PrismaClient(); // Initialize Prisma client for DB
//
// app.use(cors()); // Enable CORS
// app.use(express.json()); // To parse incoming JSON payloads
//
// app.use('/aquarium', aquariumRoutes); // Mount aquarium routes at /aquarium
//
// app.use((req, res, next) => {
//     res.status(404).json({ error: 'Route not found' });
// });
//
// const brokerUrl = process.env.BROKER_URL || 'mqtt://broker.emqx.io'; // Use environment variable
// const client = mqtt.connect(brokerUrl);
//
// async function processIncomingData(data) {
//     const { device_id, temperature, ph_level, water_level } = data;
//
//     try {
//         // Find the corresponding device in the database by its token (device_id)
//         const device = await prisma.devices.findUnique({ where: { token: device_id } });
//
//         if (device) {
//             // Save sensor data to sensor_logs
//             const sensorData = [];
//
//             if (temperature !== undefined) {
//                 sensorData.push({
//                     device_id: device.id,
//                     type: 'temp',
//                     value: temperature,
//                     data: 'Temperature update',
//                 });
//             }
//
//             if (ph_level !== undefined) {
//                 sensorData.push({
//                     device_id: device.id,
//                     type: 'ph',
//                     value: ph_level,
//                     data: 'pH level update',
//                 });
//             }
//
//             if (water_level !== undefined) {
//                 sensorData.push({
//                     device_id: device.id,
//                     type: 'water',
//                     value: water_level,
//                     data: 'Water level update',
//                 });
//             }
//
//             // Insert all sensor data in one go
//             await prisma.sensor_logs.createMany({
//                 data: sensorData.map(log => ({
//                     ...log,
//                     date: new Date(),
//                     time: new Date(),
//                 })),
//             });
//
//             console.log(`Sensor data saved successfully for device: ${device_id}`);
//         } else {
//             console.error(`Device with token ${device_id} not found in the database.`);
//         }
//     } catch (error) {
//         console.error('Error processing incoming MQTT message:', error.message);
//     }
// }
//
// const subscribeToMqtt = () => {
//     const topic = 'aquarium/monitoring';
//     console.log(`Connected to MQTT broker and subscribing to topic: ${topic}`);
//
//     client.subscribe(topic, (err) => {
//         if (err) {
//             console.error(`Failed to subscribe to ${topic}:`, err.message);
//         } else {
//             console.log(`Successfully subscribed to ${topic}`);
//         }
//     });
// };
//
// client.on('connect', subscribeToMqtt); // Subscribe once connected
//
// client.on('message', (topic, message) => {
//     try {
//         // Parse the incoming JSON message
//         const data = JSON.parse(message.toString());
//         console.log(`Received message on ${topic}:`, data);
//
//         // Process the incoming data
//         processIncomingData(data);
//     } catch (err) {
//         console.error('Error parsing or processing MQTT message:', err.message);
//     }
// });
//
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const app = require('./app');
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated');
    });
});
