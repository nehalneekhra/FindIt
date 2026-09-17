const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FoundItem",
            required: true
        },

        claimant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        finder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Claim", claimSchema);