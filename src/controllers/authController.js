const service = require('../services/authService');
const userService = require('../services/userService');
const { responseHandler, errorHandler } = require("../middlewares/responseHandler");
const {sendOtp}=require("../services/otpService")

// Register user
exports.registerUser = async (req, res, next) => {
  try {
    const { phone, email } = req.value;
    const existingPhone = await userService.isUserExist({ phone });
    if (existingPhone) {
      return responseHandler(null, res, "User already registered, Please LogIn!", 400);
    }
    
    const existingEmail = await userService.isUserExist({ email });
    if (existingEmail) {
      return responseHandler(null, res, "User already registered with the email, Please LogIn!", 400);
    }

    // Register the user without phone and profileImage
    const data = await service.registerUser(req.body);
   
    return responseHandler(data.user, res, `OTP ${data.otp}  send on registered phone.`);
  } catch (err) {
    console.log("Error:", err);
    return errorHandler(res, err.message, 500);
  }
};

// Verify Oyp phone
exports.verifyOtp = async (req, res, next) => {
  try {
    const { otp, phone } = req.value;
    // Verify the OTP for phone
    const otpResponse = await service.validateOtp(phone, otp, res);
    if (!otpResponse) {
      return
    }
    const response = await userService.findOneAndUpdate(otpResponse.user._id, { phoneVerified: true, active: true, token: otpResponse.token });
    return responseHandler({ data: response, token: otpResponse.token }, res, "User Login successfully.");
  } catch (err) {
    console.log("Error:", err);
    return errorHandler( res, err.message, 500);
  }
};

// Login User using phone
exports.loginUser = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const user = await userService.isUserExist({ phone });
    let roleType="user";
    if(req.body.role && req.body.role=="staff")
    {
      roleType="staff";
    }
    if (!user) {
      return responseHandler(null, res, "User not found", 400);
    }
    if (user?.roles!=roleType) {
      return responseHandler(null, res, "User not found", 400);
    }

    // Generate OTP for phone
    const otp = await service.loginUser(user);

    // Send the OTP to the user's phone (using an phone service like SendGrid, Nodemailer, etc.)
    console.log(`OTP sent to phone: ${otp}`);
    return responseHandler(otp, res, "OTP sent to your phone.");
  } catch (err) {
    console.log("Error:", err);
    return responseHandler(null, res, err.message, 500);
  }
};

exports.resendOtp = async (req, res, next) => {
  try {
    const { phone } = req.value; // Take validated phone from req.value
    // Check if the phone exists in the database
    const user = await userService.isUserExist({ phone });
    if (!user) {
      return responseHandler(null, res, "User not found", 400);
    }
    const otp = await service.resendOtp(user);
    console.log(`OTP sent to phone: ${otp}`);

    return responseHandler(otp, res, "OTP resent successfully");
  } catch (err) {
    return errorHandler(res, err.message, 500);
  }
};