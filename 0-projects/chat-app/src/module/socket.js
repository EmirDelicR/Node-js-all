const server = require('./app');
const socketIO = require('socket.io');

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('WebSocket connection is established!');

  /** Emit to specific user */
  socket.emit('message', 'Welcome!');

  /** Emit to all users except this one */
  socket.broadcast.emit('message', 'New user joined!');
  socket.on('sendMsg', (message, cb) => {
    /** Emit to all users */
    io.emit('message', message);
    /**Event Acknowledgment */
    cb('Delivered!');
  });

  socket.on('disconnect', () => {
    io.emit('message', 'User has left!');
  });
});

module.exports = io;
