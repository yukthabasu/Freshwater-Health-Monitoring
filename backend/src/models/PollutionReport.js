const mongoose = require("mongoose");

const pollutionReportSchema = new mongoose.Schema(
    {
        waterBody: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WaterBody",
            required: true
        },

        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        pollutionType: {
            type: String,
            enum: [
                "Plastic Waste",
                "Sewage",
                "Chemical Waste",
                "Oil Spill",
                "Garbage Dumping",
                "Dead Fish",
                "Other"
            ],
            required: true
        },

        description: {
            type: String,
            required: true
        },

        severity: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium"
        },

        location: {
            latitude: Number,
            longitude: Number
        },

        evidenceImage: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["Pending", "Verified", "Rejected"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("PollutionReport", pollutionReportSchema);