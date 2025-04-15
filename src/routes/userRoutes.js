const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController.js');
const { validatePost, validateParams } = require('../middlewares/validator');
const {
  userIdSchema,
  updateUserSchema
} = require("../validators/userValidators.js"); // Import Joi validation schemas
const { verifyToken, isAdmin } = require("../middlewares/auth.js");

// Get user by TOKEN
router.route("/").get(verifyToken, userController.getUserByToken);

// Soft delete user
router.route("/soft-delete/:id").delete(validateParams(userIdSchema), verifyToken, userController.softDeleteUser);

// List users
router.route("/list").get(verifyToken, isAdmin, userController.listUsers);

// Get user by ID
router.route("/:id").get(validateParams(userIdSchema), verifyToken, isAdmin, userController.getUserById);

// Update user by ID
router.route("/:id").put(validateParams(userIdSchema), validatePost(updateUserSchema), verifyToken, userController.updateUser);

// Hard delete user
router.route("/:id").delete(validateParams(userIdSchema), verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
