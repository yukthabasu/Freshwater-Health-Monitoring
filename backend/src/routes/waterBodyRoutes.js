const express = require("express");

const {
    createWaterBody,
    getWaterBodies,
    getWaterBodyById
} = require("../controllers/waterBodyController");

const router = express.Router();

router.get("/", getWaterBodies);

router.post("/", createWaterBody);

router.get("/:id", getWaterBodyById);

module.exports = router;