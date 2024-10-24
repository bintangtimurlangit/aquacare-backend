const WebSocket = require('ws');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Enable query logging
});

const setupWebSocketServer = (server) => {
    const wss = new WebSocket.Server({ server });

    // Function to poll for new sensor logs
    const pollSensorLogs = async (ws, token) => {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        try {
            const sensorLogs = await prisma.sensor_logs.findMany({
                where: {
                    devices: {
                        token: token, // Match the token in the devices table
                    },
                },
                orderBy: {
                    date: 'desc', // Order by date in descending order to get the latest entries first
                },
                take: 720, // Limit to the latest entries; adjust based on logging frequency
            });

            console.log("Prisma sensorLogs query result:", sensorLogs);

            if (sensorLogs && sensorLogs.length > 0) {
                // Extract only type and value fields to send to the client
                const processedData = sensorLogs.map(log => ({
                    type: log.type,
                    value: log.value,
                }));

                // Send the data to the client
                ws.send(JSON.stringify(processedData));
                console.log(JSON.stringify(processedData));
            } else {
                console.log("No sensor logs found for the device token:", token);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            ws.send(JSON.stringify({ error: 'Failed to fetch data' }));
        }
    };

    // Handle WebSocket connections
    wss.on('connection', (ws) => {
        console.log('Client connected');

        // Listen for messages from the client
        ws.on('message', async (message) => {
            const data = JSON.parse(message);
            console.log('Received message:', data);

            if (data.token) {
                console.log('Client token:', data.token);

                // Start polling the sensor logs every 5 seconds
                const pollingInterval = setInterval(() => {
                    pollSensorLogs(ws, data.token); // Poll the database for updates
                }, 5000); // Poll every 5 seconds

                // Clear the interval when WebSocket connection is closed
                ws.on('close', () => {
                    clearInterval(pollingInterval);
                    console.log('WebSocket Client Disconnected');
                });
            }
        });

        // Handle client disconnection
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
};

module.exports = setupWebSocketServer;