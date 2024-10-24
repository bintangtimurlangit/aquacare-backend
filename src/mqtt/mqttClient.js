const mqtt = require('mqtt');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient(); // Initialize Prisma client
const brokerUrl = process.env.BROKER_URL || 'mqtt://broker.emqx.io'; // Use environment variable
const client = mqtt.connect(brokerUrl);

// Process incoming MQTT messages
async function processIncomingData(data) {
    const { device_id, temperature, ph_level, water_level } = data;

    try {
        const device = await prisma.devices.findUnique({ where: { token: device_id } });

        if (device) {
            const sensorData = [];

            if (temperature !== undefined) {
                sensorData.push({
                    device_id: device.id,
                    type: 'temp',
                    value: temperature,
                    data: 'Temperature update',
                });
            }

            if (ph_level !== undefined) {
                sensorData.push({
                    device_id: device.id,
                    type: 'ph',
                    value: ph_level,
                    data: 'pH level update',
                });
            }

            if (water_level !== undefined) {
                sensorData.push({
                    device_id: device.id,
                    type: 'water',
                    value: water_level,
                    data: 'Water level update',
                });
            }

            await prisma.sensor_logs.createMany({
                data: sensorData.map(log => ({
                    ...log,
                    date: new Date(),
                    time: new Date(),
                })),
            });

            console.log(`Sensor data saved successfully for device: ${device_id}`);
        } else {
            console.error(`Device with token ${device_id} not found in the database.`);
        }
    } catch (error) {
        console.error('Error processing incoming MQTT message:', error.message);
    }
}

// Subscribe to MQTT topic
function subscribeToMqtt() {
    const topic = 'aquarium/monitoring';
    console.log(`MQTT client functional! Subscribed to topic: ${topic}`);

    client.subscribe(topic, (err) => {
        if (err) {
            console.error(`Failed to subscribe to ${topic}:`, err.message);
        } else {
            console.log(`Successfully subscribed!`);
        }
    });
}

client.on('connect', subscribeToMqtt);

client.on('message', (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        console.log(`Received message on ${topic}:`, data);
        processIncomingData(data);
    } catch (err) {
        console.error('Error parsing or processing MQTT message:', err.message);
    }
});

module.exports = client;
