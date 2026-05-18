let io;

module.exports = {
  init: (server) => {
    io = require('socket.io')(server, {
      cors: {
        origin: '*',
      },
    });

    io.on('connection', (socket) => {
      console.log('Client Connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client Disconnect');
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized');
    }

    return io;
  },
};