const mongoose = require("mongoose");
const { Schema } = mongoose;

// OTP Schema
const otpSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String },
  phone: { type: String },
  otp: { type: String, required: true },
  type: { type: String, enum: ["email", "phone"], required: true }, // 'type' is required
}, { timestamps: true });


// TTL index to delete OTP 5 minutes (300 seconds) after creation
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model("OTP", otpSchema);
