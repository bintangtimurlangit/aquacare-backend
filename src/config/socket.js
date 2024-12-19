const { Server } = require('socket.io');

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', socket => {
    console.log('Client connected');

    // Subscribe to specific device updates
    socket.on('subscribe_device', deviceId => {
      socket.join(`device_${deviceId}`);
      console.log(`Client subscribed to device: ${deviceId}`);
    });

    // Unsubscribe from device updates
    socket.on('unsubscribe_device', deviceId => {
      socket.leave(`device_${deviceId}`);
      console.log(`Client unsubscribed from device: ${deviceId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
}

// Export both the initialization function and a way to emit events
module.exports = {
  initializeSocket,
  emitMetricsUpdate: (io, deviceId, metrics) => {
    io.to(`device_${deviceId}`).emit('metrics_update', {
      deviceId,
      metrics,
      timestamp: new Date(),
    });
  },
};
