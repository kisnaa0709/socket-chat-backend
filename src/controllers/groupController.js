const groupService = require('../services/groupService');
const queries = require('../queries/groupQueries');
const { socketResponseHandler, socketErrorHandler } = require('../middlewares/responseHandler');

/**
 * Handle group creation
 * @param {Object} socket - Socket.io socket
 * @param {Object} io - Socket.io server instance
 */
exports.handleCreateGroup = (socket, io) => {
  socket.on('createGroup', async (data) => {
    try {
      const { groupName, members } = data;
      const group = await groupService.createGroup(groupName, members);

      members.forEach((member) => {
        io.to(member).emit('groupCreated', {
          success: true,
          message: 'You have been added to a new group',
          data: group
        });
      });
      
      socketResponseHandler(group, socket, 'groupCreated', 'Group created successfully');
    } catch (error) {
      console.error('Error creating group:', error);
      socketErrorHandler(socket, 'error', 'Failed to create group', 500);
    }
  });
};

/**
 * Handle joining a group
 * @param {Object} socket - Socket.io socket
 * @param {Object} io - Socket.io server instance
 */
exports.handleJoinGroup = (socket, io) => {
  socket.on('joinGroup', (groupId) => {
    try {
      socket.join(groupId);
      socketResponseHandler({ groupId }, socket, 'groupJoined', 'Group joined successfully');
    } catch (error) {
      console.error('Error joining group:', error);
      socketErrorHandler(socket, 'error', 'Failed to join group', 500);
    }
  });
};

/**
 * Handle getting user's groups
 * @param {Object} socket - Socket.io socket
 * @param {Object} io - Socket.io server instance
 */
exports.handleGetUserGroups = (socket, io) => {
  socket.on('getUserGroups', async (userId) => {
    try {
      const groups = await groupService.getUserGroups(userId);
      socketResponseHandler(groups, socket, 'userGroups', 'User groups retrieved');
    } catch (error) {
      console.error('Error getting user groups:', error);
      socketErrorHandler(socket, 'error', 'Failed to get user groups', 500);
    }
  });
};

/**
 * Handle adding member to group
 * @param {Object} socket - Socket.io socket
 * @param {Object} io - Socket.io server instance
 */
exports.handleAddMember = (socket, io) => {
  socket.on('addGroupMember', async (data) => {
    try {
      const { groupId, userId } = data;
      const updatedGroup = await groupService.addMember(groupId, userId);
      
      io.to(userId).emit('groupInvite', {
        success: true,
        message: 'You have been added to a group',
        data: updatedGroup
      });
      
      socketResponseHandler(updatedGroup, socket, 'memberAdded', 'Member added to group');
    } catch (error) {
      console.error('Error adding member to group:', error);
      socketErrorHandler(socket, 'error', 'Failed to add member to group', 500);
    }
  });
};

/**
 * Set up all group-related socket event handlers
 * @param {Object} socket - Socket.io socket
 * @param {Object} io - Socket.io server instance
 */
exports.setupGroupHandlers = (socket, io) => {
  this.handleCreateGroup(socket, io);
  this.handleJoinGroup(socket, io);
  this.handleGetUserGroups(socket, io);
  this.handleAddMember(socket, io);
};