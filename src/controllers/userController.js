const service = require('../services/userService');
const queries = require('../queries/userQueries');
const { responseHandler, errorHandler } = require("../middlewares/responseHandler");

// Get User by TOKEN
exports.getUserByToken = async (req, res) => {
  try {
    const id = req.user.userId
    const user = await service.findUserById(id);
    return user ? responseHandler(user, res) : responseHandler(null, res, "User not found", 404);
  } catch (err) {
    return errorHandler(res, err.message, 500);
  }
};


// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id
    const user = await service.findUserById(id);
    return user ? responseHandler(user, res) : responseHandler(null, res, "User not found", 404);
  } catch (err) {
    return errorHandler(res, err.message, 500);
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.value;
    const user = await service.updateUser(id, body);
    const userData = await service.findUserById(user?.id)
    return responseHandler(userData, res, "User updated successfully");
  } catch (err) {
    return errorHandler(res, err.message, 500);
  }
};

// Soft Delete User
exports.softDeleteUser = async (req, res) => {
  try {
    await service.softDeleteUser(req.params.id);
    return responseHandler(null, res, "User soft deleted successfully");
  } catch (err) {
    return errorHandler(res, err.message, 500);
  }
};

// Hard Delete User
exports.deleteUser = async (req, res) => {
  try {
    await service.deleteUser(req.user.userId);
    return responseHandler(null, res, "User deleted successfully");
  } catch (err) {
    return errorHandler(res, err.message, 500);
  }
};

// List Users
exports.listUsers = async (req, res) => {
  try {
    const reqQuery = req.query;
    let sort = { createdAt: -1 };
    const pagination = { skip: 0, limit: 25 };
    if (reqQuery.pageNo && reqQuery.pageSize) {
      pagination.skip = parseInt((reqQuery.pageNo - 1) * reqQuery.pageSize);
      pagination.limit = parseInt(reqQuery.pageSize);
    }
    const filter = {};

    if (reqQuery.fullName)
      filter["fullName"] = { $regex: reqQuery.fullName, $options: "i" };

    if (reqQuery.sortType && reqQuery.sortOrder) {
      const type = reqQuery.sortType;
      const value = reqQuery.sortOrder;
      sort = { [type]: parseInt(value) };
    }

    const query = queries.search(filter, pagination, sort);
    const users = await service.search(query);
    return responseHandler(users, res);
  } catch (err) {
    return errorHandler(res, err.message, 500);
  }
};
