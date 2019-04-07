let io;

const init = server => {
  io = require("socket.io")(server);
  return io;
};

const connect = server => {
  const io = init(server);
  io.on("connection", socket => {
    console.log("Client connected with WebSocket!");
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = {
  init,
  connect,
  getIO
};
