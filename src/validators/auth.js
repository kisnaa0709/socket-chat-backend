const Joi = require("joi");

// Schema for Initial Registration (first step, without phoneNumber)
const registerInitialSchema = Joi.object({
  fullName: Joi.string().required().trim().min(2).max(50), // Full name
  dob: Joi.date().required(), // Date of birth
  phone: Joi.string().required().trim(), //  phone number
  email: Joi.string().email().trim().lowercase(), // Email address
  anniversary: Joi.date().optional(), // Anniversary (optional)'
  profileImage: Joi.string().optional(), // Profile image (optional)
  gender: Joi.string().valid("Male", "Female", "Other").required(), // Gender
});

// Schema for  Verification (Step 2)
const verifyPhoneSchema = Joi.object({
  otp: Joi.string().required().trim().length(6), // Verification code for 
  phone: Joi.string().required().trim(), //  phone number
});

// Schema for generating OTP (email or phone)
const generateOtpSchema = Joi.object({
  phone: Joi.string().required().trim(), //  or phone number
});

module.exports = { registerInitialSchema, verifyPhoneSchema, generateOtpSchema };
