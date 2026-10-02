const express = require("express");
const multer = require("multer");
const path = require("path");

const {
    createPollutionReport,
    getPollutionReports,
    getPollutionReportById,
    updatePollutionReportStatus
} = require("../controllers/pollutionReportController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

// Configure image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(
            null,
            path.join(
                __dirname,
                "../../uploads"
            )
        );
    },

    filename: (req, file, cb) => {
        const extension =
            path.extname(
                file.originalname
            );

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(
                Math.random() * 1e9
            ) +
            extension;

        cb(
            null,
            uniqueName
        );
    }
});

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (
        req,
        file,
        cb
    ) => {
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (
            allowedTypes.includes(
                file.mimetype
            )
        ) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only JPG, JPEG, PNG and WEBP images are allowed."
                )
            );
        }
    }
});

// Get all pollution reports
// Login required
router.get(
    "/",
    protect,
    getPollutionReports
);

// Create pollution report
// Login required
router.post(
    "/",
    protect,
    upload.single(
        "evidenceImage"
    ),
    createPollutionReport
);

// Get one pollution report
// Login required
router.get(
    "/:id",
    protect,
    getPollutionReportById
);

// Update report status
// Admin only
router.put(
    "/:id/status",
    protect,
    adminOnly,
    updatePollutionReportStatus
);

module.exports = router;