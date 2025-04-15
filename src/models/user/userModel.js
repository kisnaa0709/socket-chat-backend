const mongoose = require('mongoose');
const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  userId: {type: String,required: true,unique: true},
  phone: { type: String, required: true, trim: true, unique: true },
  anniversary: { type: Date, required: false },
  profileImage: { type: String, required: false },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  roles: {
    type: [
      {
        type: String,
        enum: ["user", "admin"],
      },
    ], default: ['user']
  },  // Add roles array for flexibility
  active: { type: Boolean, default: true }, // Active status
  lastActiveAt: { type: Date },  // To track the last time the user was active
  authToken: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
