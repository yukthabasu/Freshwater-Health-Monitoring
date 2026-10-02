const PollutionReport = require("../models/PollutionReport");

const createPollutionReport = async (
    req,
    res
) => {
    try {
        const {
            waterBody,
            pollutionType,
            description,
            severity,
            latitude,
            longitude
        } = req.body;

        if (
            !waterBody ||
            !pollutionType ||
            !description
        ) {
            return res.status(400).json({
                message:
                    "Water body, pollution type and description are required"
            });
        }

        // The reporter is taken from the
        // authenticated JWT user.
        const reportedBy = req.user._id;

        // Create image URL if an evidence
        // image was uploaded.
        let evidenceImage = "";

        if (req.file) {
            evidenceImage =
                `/uploads/${req.file.filename}`;
        }

        const report =
            await PollutionReport.create({
                waterBody,
                reportedBy,
                pollutionType,
                description,
                severity:
                    severity || "Medium",

                location: {
                    latitude:
                        latitude !==
                            undefined &&
                            latitude !== null &&
                            latitude !== ""
                            ? Number(latitude)
                            : null,

                    longitude:
                        longitude !==
                            undefined &&
                            longitude !== null &&
                            longitude !== ""
                            ? Number(longitude)
                            : null
                },

                evidenceImage,

                status: "Pending"
            });

        const populatedReport =
            await PollutionReport.findById(
                report._id
            )
                .populate(
                    "waterBody",
                    "name type location healthStatus"
                )
                .populate(
                    "reportedBy",
                    "name email"
                );

        res.status(201).json({
            message:
                "Pollution report submitted successfully",

            report: populatedReport
        });
    } catch (error) {
        console.error(
            "Create pollution report error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to create pollution report",

            error: error.message
        });
    }
};

const getPollutionReports = async (
    req,
    res
) => {
    try {
        const reports =
            await PollutionReport.find()
                .populate(
                    "waterBody",
                    "name type location healthStatus"
                )
                .populate(
                    "reportedBy",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            count: reports.length,
            reports
        });
    } catch (error) {
        console.error(
            "Get pollution reports error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch pollution reports",

            error: error.message
        });
    }
};

const getPollutionReportById =
    async (req, res) => {
        try {
            const report =
                await PollutionReport.findById(
                    req.params.id
                )
                    .populate(
                        "waterBody",
                        "name type location healthStatus"
                    )
                    .populate(
                        "reportedBy",
                        "name email"
                    );

            if (!report) {
                return res.status(404).json({
                    message:
                        "Pollution report not found"
                });
            }

            res.status(200).json(
                report
            );
        } catch (error) {
            console.error(
                "Get pollution report error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch pollution report",

                error: error.message
            });
        }
    };

const updatePollutionReportStatus =
    async (req, res) => {
        try {
            const { status } =
                req.body;

            const allowedStatuses = [
                "Pending",
                "Verified",
                "Rejected"
            ];

            if (
                !allowedStatuses.includes(
                    status
                )
            ) {
                return res.status(400).json({
                    message:
                        "Invalid status. Use Pending, Verified or Rejected."
                });
            }

            const report =
                await PollutionReport.findById(
                    req.params.id
                );

            if (!report) {
                return res.status(404).json({
                    message:
                        "Pollution report not found"
                });
            }

            report.status = status;

            await report.save();

            const updatedReport =
                await PollutionReport.findById(
                    report._id
                )
                    .populate(
                        "waterBody",
                        "name type location healthStatus"
                    )
                    .populate(
                        "reportedBy",
                        "name email"
                    );

            res.status(200).json({
                message:
                    `Report status updated to ${status}`,

                report:
                    updatedReport
            });
        } catch (error) {
            console.error(
                "Update pollution report status error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update report status",

                error: error.message
            });
        }
    };

module.exports = {
    createPollutionReport,
    getPollutionReports,
    getPollutionReportById,
    updatePollutionReportStatus
};