const Group = require('../models/groupModel');
const dal = require('../dal/dal');
const queries = require('../queries/groupQueries');

/**
 * Create a new group
 * @param {string} name - Group name
 * @param {Array} members - Array of member IDs
 * @returns {Promise<Object>} Group object
 */
exports.createGroup = async (name, members) => {
  return await dal.create(Group, { name, members });
};

/**
 * Find a group by ID
 * @param {string} id - Group ID
 * @returns {Promise<Object>} Group object
 */
exports.findGroupById = async (id) => {
  return await dal.findOne(Group, { _id: id });
};

/**
 * Get all groups a user is a member of
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of groups
 */
exports.getUserGroups = async (userId) => {
  return await dal.find(Group, { members: userId });
};

/**
 * Update group
 * @param {string} id - Group ID
 * @param {Object} body - Group update data
 * @returns {Promise<Object>} Updated group
 */
exports.updateGroup = async (id, body) => {
  return await dal.findOneAndUpdate(Group, { _id: id }, body);
};

/**
 * Delete group
 * @param {string} id - Group ID
 * @returns {Promise<Object>} Deleted group
 */
exports.deleteGroup = async (id) => {
  return await dal.findOneAndDelete(Group, { _id: id });
};

/**
 * Add member to group
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID to add
 * @returns {Promise<Object>} Updated group
 */
exports.addMember = async (groupId, userId) => {
  return await dal.findOneAndUpdate(Group, { _id: groupId }, { $addToSet: { members: userId } });
};

/**
 * Remove member from group
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID to remove
 * @returns {Promise<Object>} Updated group
 */
exports.removeMember = async (groupId, userId) => {
  return await dal.findOneAndUpdate(Group, { _id: groupId }, { $pull: { members: userId } });
};

/**
 * Search groups
 * @param {Object} query - Search query
 * @returns {Promise<Object>} Search results
 */
exports.search = async (query) => {
  const data = await dal.aggregate(Group, query);
  
  return {
    data: data[0].data,
    totalCount: data[0].count[0] ? data[0].count[0].count : 0,
  };
};