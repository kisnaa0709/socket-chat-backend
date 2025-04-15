const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const { validatePost, validateQuery } = require('../middlewares/validator');
const {
    registerInitialSchema,
    verifyPhoneSchema,
    generateOtpSchema
} = require('../validators/auth'); // Import Joi validation schemas


// Middleware to validate uploaded files
  
// Initial registration (phone number)
router.route("/register").post(validatePost(registerInitialSchema),authController.registerUser);
// Phone Verification
router.route("/verifyOtp").post(validatePost(verifyPhoneSchema), authController.verifyOtp);

// Login user (phone)
router.route("/login").post(validatePost(generateOtpSchema), authController.loginUser);

// Resend OTP
router.route("/resendtp").get(validateQuery(generateOtpSchema), authController.resendOtp);


module.exports = router;
