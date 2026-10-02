const express = require("express");

const {
    createComment,
    getCommentsByReport,
    deleteComment
} = require("../controllers/commentController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all comments for a report
router.get(
    "/report/:reportId",
    protect,
    getCommentsByReport
);

// Add a comment
router.post(
    "/",
    protect,
    createComment
);

// Delete own comment or admin comment
router.delete(
    "/:id",
    protect,
    deleteComment
);

module.exports = router;