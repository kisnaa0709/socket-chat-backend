const OTPModel = require("../models/user/otpModel");
const userService = require("./userService");
const dal = require("../dal/dal");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../middlewares/responseHandler");
require("dotenv").config();

// For generating OTP code
const getOtp = () => Math.floor(Math.random() * (9 * Math.pow(10, 6 - 1))) + Math.pow(10, 6 - 1);

// For generating Token
const getToken = async (body) => {
    return await jwt.sign(body, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    });
};

// Registering a user and sending OTP (email)
exports.registerUser = async (value) => {
    const user = await userService.createUser(value);
    const otp = getOtp();

    // Create OTP record
    await dal.create(OTPModel, {
        userId: user._id,
        otp,
        phone: value.phone,
        type: 'phone', // Assuming this is for phone verification
    });

    return { user, otp };
};

// Validate Phone OTP
exports.validateOtp = async (phone, code, res) => {
    // Check if user exists
    const user = await userService.isUserExist({ phone });
    if (!user) {
        return errorHandler(res, "User not found");
    }
    // Find OTP record in the database
    const otpRecord = await dal.findOne(OTPModel, { phone: phone, otp: code, type: "phone", });
    if (!otpRecord) {
        errorHandler(res, "Invalid OTP");
        return
    }

    // OTP is valid and not expired, delete OTP after use
    await dal.findOneAndDelete(OTPModel, { phone: phone, otp: code, type: "phone" });
    const token = await generateAccessToken(otpRecord?.userId)

    return { user, token };
};

// Login functionality
exports.loginUser = async (user) => {
    // Generate OTP code
    const otp = getOtp();

    // Save OTP to the database
    const otpData = {
        userId: user._id,
        phone: user.phone,
        otp,
        type: "phone", // Phone login OTP
    };

    await dal.findOneAndUpsert(
        OTPModel,
        {
            userId: user._id,
            phone: user.phone
        },
        otpData
    );
    return otp; // Return OTP (you would send this OTP to the user via email)
};

// Resend Otp functionality
exports.resendOtp = async (user) => {
    // Generate OTP code
    const otp = getOtp();

    // Save OTP to the database
    const otpData = {
        userId: user._id,
        phone: user.phone,
        otp,
        type: "phone", // phone login OTP
    };

    // Save OTP in the database
    await dal.findOneAndUpsert(
        OTPModel,
        {
            userId: user._id,
            phone: user.phone
        },
        otpData
    );
    return otp; // Return OTP (you would send this OTP to the user via phone)
};

const generateAccessToken = async (_id) => {
    const user = await userService.findUserById(_id);
    if (!user) return false;
    return await getToken({ userId: user._id });
};

exports.updateOtp = async (phone, otp) => {
    return await dal.findOneAndUpdate(OTPModel, { phone }, { otp });
};

