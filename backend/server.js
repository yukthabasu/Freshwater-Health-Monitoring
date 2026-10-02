const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const waterBodyRoutes = require("./src/routes/waterBodyRoutes");
const pollutionReportRoutes = require("./src/routes/pollutionReportRoutes");
const commentRoutes = require("./src/routes/commentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve uploaded evidence images
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// API routes
app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/water-bodies",
    waterBodyRoutes
);

app.use(
    "/api/pollution-reports",
    pollutionReportRoutes
);

app.use(
    "/api/comments",
    commentRoutes
);

app.get("/", (req, res) => {
    res.json({
        message:
            "Freshwater Health Monitoring API is running!"
    });
});

app.get(
    "/api/health",
    (req, res) => {
        res.json({
            status: "OK",
            message:
                "Backend is healthy"
        });
    }
);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log(
            "MongoDB connected successfully"
        );

        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });