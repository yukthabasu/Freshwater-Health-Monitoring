const WaterBody = require("../models/WaterBody");

// Create water body
const createWaterBody = async (req, res) => {
    try {
        const {
            name,
            type,
            address,
            latitude,
            longitude,
            description,
            healthStatus
        } = req.body;

        if (
            !name ||
            !type ||
            !address ||
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                message:
                    "Name, type, address, latitude and longitude are required"
            });
        }

        const waterBody = await WaterBody.create({
            name,
            type,
            location: {
                address,
                latitude,
                longitude
            },
            description: description || "",
            healthStatus: healthStatus || "Good"
        });

        res.status(201).json({
            message: "Water body created successfully",
            waterBody
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create water body",
            error: error.message
        });
    }
};

// Get all water bodies
const getWaterBodies = async (req, res) => {
    try {
        const waterBodies = await WaterBody.find().sort({
            createdAt: -1
        });

        res.status(200).json({
            count: waterBodies.length,
            waterBodies
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch water bodies",
            error: error.message
        });
    }
};

// Get one water body
const getWaterBodyById = async (req, res) => {
    try {
        const waterBody = await WaterBody.findById(req.params.id);

        if (!waterBody) {
            return res.status(404).json({
                message: "Water body not found"
            });
        }

        res.status(200).json(waterBody);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch water body",
            error: error.message
        });
    }
};

module.exports = {
    createWaterBody,
    getWaterBodies,
    getWaterBodyById
};