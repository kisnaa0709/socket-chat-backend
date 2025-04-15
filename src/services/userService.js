const model = require("../models/user/userModel");
const dal = require("../dal/dal");
const {generateNextUserID} = require("../config/helpers");

// Create User
exports.createUser = async (body) => {
  body.userId = await generateNextUserID();
  return await dal.findOneAndUpsert(model, { phone: body.phone }, body);
};

// Checking if user exists
exports.isUserExist = async (filter) => {
  return await dal.findOne(model, { ...filter });
};

// Update user data
exports.findOneAndUpdate = async (id, body) => {
  return await dal.findOneAndUpdate(model, { _id: id }, body);
};

// Find User by ID
exports.findUserById = async (id) => {
  return await dal.findOne(model, { _id: id, active: true });
};

// Update User by ID
exports.updateUser = async (id, body) => {
  return await dal.findOneAndUpdate(model, { _id: id }, body);
};

// Soft Delete User (Set active to false)
exports.softDeleteUser = async (id) => {
  return await dal.findOneAndUpdate(model, { _id: id }, { active: false });
};

// Hard Delete User
exports.deleteUser = async (id) => {
  return await dal.findOneAndDelete(model, { _id: id });
};

// Update Multiple Users
exports.updateManyUsers = async (filter, updateData) => {
  return await dal.updateMany(model, filter, updateData);
};

// Delete Multiple Users
exports.deleteManyUsers = async (filter) => {
  return await dal.deleteMany(model, filter);
};

exports.search = async (query) => {
  const data = await dal.aggregate(model, query);

  return {
    data: data[0].data,
    totalCount: data[0].count[0] ? data[0].count[0].count : 0,
  };
};