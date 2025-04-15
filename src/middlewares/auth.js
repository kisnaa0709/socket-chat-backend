const jwt = require("jsonwebtoken");
const {
  responseHandler,
  errorHandler,
} = require("./responseHandler");

const dal = require("../dal/dal");
const model = require("../models/user/userModel"); // Updated model import for user

// Token Verification Middleware
exports.verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return responseHandler(null, res, "Unauthorized!", 401);
  }
  try {
    if (token.includes("Bearer")) {
      token = token.substr(7); // Remove "Bearer " prefix
    }

    // Verify token using secret
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return responseHandler(null, res, "Invalid Token!", 403);
    }
    
    // Update last active time for the user in the DB
    const activityTime = new Date();
    const user = await dal.findOneAndUpdate(
      model,
      { _id: decoded.userId, active: true },
      { lastActiveAt: activityTime }
    );
    if (!user) return errorHandler(res, "User not found!", 400);
    
    // Attach user data to the request object for later use in controllers
    const userData = {
      ...decoded,
      fullName: user.fullName,
      email: user.email,
      roles: user.roles,
    };
    
    req.user = userData;
    next();
  } catch (err) {
    console.log("Error is : ", err);
    return errorHandler(res, err.message, 500);
  }
};

// Admin Check Middleware
exports.isAdmin = async (req, res, next) => {
  try {
    // Check if the user has 'admin' role
    if (req.user.roles.indexOf("admin") !== -1) {
      return next(); // User is an admin, allow to proceed
    } else {
      return errorHandler(res, "Access Denied!", 403);
    }
  } catch (err) {
    console.log("Error: ", err);
    return errorHandler(res, err.message, 500);
  }
};
