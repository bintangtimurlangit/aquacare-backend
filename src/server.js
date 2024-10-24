const app = require('./app');
const mqttClient = require('./mqtt/mqttClient');
const setupWebSocketServer = require('./websocket/websocketServer');

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Main server is on!`);
    console.log(`Running on http://localhost:${PORT}\n`);
});

setupWebSocketServer(server);
console.log(`WebSocket server is on!`);

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated');
    });
});
