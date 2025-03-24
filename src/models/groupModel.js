const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = Schema(
    {
        name: String,
        members: [
            {
                type: Schema.ObjectId,
                ref: "User",
            }
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Group", GroupSchema);