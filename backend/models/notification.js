const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: [
                "new_claim",
                "claim_accepted",
                "claim_rejected"
            ],
            required: true
        },

        title: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        },

        relatedClaim: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Claim",
            default: null
        },

        relatedItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FoundItem",
            default: null
        },

        read: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);