const messageService = require('../services/messageService');
const queries = require('../queries/messageQueries');
const { socketResponseHandler, socketErrorHandler } = require('../middlewares/responseHandler');

/**
 * Handle sending messages
 * @param {Object} socket - Socket.io socket
 * @param {Object} io - Socket.io server instance
 */
exports.handleSendMessage = (socket, io) => {
  socket.on('sendMessage', async (data) => {
    try {
      const { senderId, receiverId, message, groupId } = data;
      const newMessage = await messageService.createMessage(senderId, receiverId, message, groupId);

      if (groupId) {
        io.to(groupId).emit('receiveMessage', {
          success: true,
          message: 'New message received',
          data: newMessage
        });
      } else {
        io.to(receiverId).emit('receiveMessage', {
          success: true,
          message: 'New message received',
          data: newMessage
        });
      }
      
      socketResponseHandler(newMessage, socket, 'messageSent', 'Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      socketErrorHandler(socket, 'error', 'Failed to send message', 500);
    }
  });
};

/**
 * Handle getting messages between users
 * @param {Object} socket - Socket.io socket
 * @param {Object} io - Socket.io server instance
 */
exports.handleGetUserMessages = (socket, io) => {
  socket.on('getUserMessages', async (data) => {
    try {
      const { senderId, receiverId } = data;
      const messages = await messageService.getMessagesBetweenUsers(senderId, receiverId);
      socketResponseHandler(messages, socket, 'userMessages', 'User messages retrieved');
    } catch (error) {
      console.error('Error getting user messages:', error);
      socketErrorHandler(socket, 'error', 'Failed to get user messages', 500);
    }
  });
};

/**
 * Handle getting group messages
 * @param {Object} socket - Socket.io socket
 * @param {Object} io - Socket.io server instance
 */
exports.handleGetGroupMessages = (socket, io) => {
  socket.on('getGroupMessages', async (groupId) => {
    try {
      const messages = await messageService.getGroupMessages(groupId);
      socketResponseHandler(messages, socket, 'groupMessages', 'Group messages retrieved');
    } catch (error) {
      console.error('Error getting group messages:', error);
      socketErrorHandler(socket, 'error', 'Failed to get group messages', 500);
    }
  });
};

/**
 * Set up all message-related socket event handlers
 * @param {Object} socket - Socket.io socket
 * @param {Object} io - Socket.io server instance
 */
exports.setupMessageHandlers = (socket, io) => {
  this.handleSendMessage(socket, io);
  this.handleGetUserMessages(socket, io);
  this.handleGetGroupMessages(socket, io);
};