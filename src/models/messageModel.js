const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = Schema(
    {
        senderId: {
            type: Schema.ObjectId,
            ref: "User",
        },
        receiverId: {
            type: Schema.ObjectId,
            ref: "User",
        },
        groupId: {
            type: Schema.ObjectId,
            ref: "Group",
        },
        message: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Message", MessageSchema);