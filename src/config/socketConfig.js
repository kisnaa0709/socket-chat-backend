const { Server } = require('socket.io');
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');
const groupController = require('../controllers/groupController');

/**
 * Initialize and configure Socket.io
 * @param {Object} server - HTTP server instance
 * @returns {Object} Socket.io instance
 */
exports.initializeSocketIO = async (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    // Setup all socket event handlers
    userController.setupUserHandlers(socket, io);
    messageController.setupMessageHandlers(socket, io);
    groupController.setupGroupHandlers(socket, io);
  });

  return io;
}; 