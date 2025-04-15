const Joi = require("joi");

// Schema for User ID validation
const userIdSchema = Joi.object({
  id: Joi.string().required().trim().length(24), // MongoDB ObjectId
});

// Schema for Updating a User
const updateUserSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(50),
  dob: Joi.date(),
  email: Joi.string().email().trim().lowercase(),
  anniversary: Joi.date().optional(),
  profileImage: Joi.string().trim(),
  gender: Joi.string().valid("Male", "Female", "Other")
});

module.exports = { userIdSchema, updateUserSchema };
