const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema(
    {
        fullName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("users", UserSchema);