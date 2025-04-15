const Message = require('../models/messageModel');
const dal = require('../dal/dal');
const queries = require('../queries/messageQueries');

/**
 * Create a new message
 * @param {string} senderId - Sender ID
 * @param {string} receiverId - Receiver ID
 * @param {string} message - Message content
 * @param {string} groupId - Group ID (optional)
 * @returns {Promise<Object>} Message object
 */
exports.createMessage = async (senderId, receiverId, message, groupId) => {
  return await dal.create(Message, { senderId, receiverId, groupId, message });
};

/**
 * Get messages between two users
 * @param {string} senderId - Sender ID
 * @param {string} receiverId - Receiver ID
 * @returns {Promise<Array>} Array of messages
 */
exports.getMessagesBetweenUsers = async (senderId, receiverId) => {
  const filter = {
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId }
    ]
  };
  const sort = { createdAt: 1 };
  return await dal.find(Message, filter, {}, sort);
};

/**
 * Get messages in a group
 * @param {string} groupId - Group ID
 * @returns {Promise<Array>} Array of messages
 */
exports.getGroupMessages = async (groupId) => {
  return await dal.find(Message, { groupId }, {}, { createdAt: 1 });
};

/**
 * Delete message
 * @param {string} id - Message ID
 * @returns {Promise<Object>} Deleted message
 */
exports.deleteMessage = async (id) => {
  return await dal.findOneAndDelete(Message, { _id: id });
};

/**
 * Search messages
 * @param {Object} query - Search query
 * @returns {Promise<Object>} Search results
 */
exports.search = async (query) => {
  const data = await dal.aggregate(Message, query);
  
  return {
    data: data[0].data,
    totalCount: data[0].count[0] ? data[0].count[0].count : 0,
  };
};