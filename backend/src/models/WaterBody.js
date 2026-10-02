const mongoose = require("mongoose");

const waterBodySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: ["river", "lake", "pond"],
            required: true
        },

        location: {
            address: {
                type: String,
                required: true
            },

            latitude: {
                type: Number,
                required: true
            },

            longitude: {
                type: Number,
                required: true
            }
        },

        description: {
            type: String,
            default: ""
        },

        healthStatus: {
            type: String,
            enum: ["Good", "Moderate", "Poor", "Critical"],
            default: "Good"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("WaterBody", waterBodySchema);