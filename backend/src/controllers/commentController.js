const Comment = require("../models/Comment");

const createComment = async (req, res) => {
    try {
        const {
            report,
            text
        } = req.body;

        if (!report || !text) {
            return res.status(400).json({
                message:
                    "Report ID and comment text are required"
            });
        }

        const comment =
            await Comment.create({
                report,
                user: req.user._id,
                text: text.trim()
            });

        const populatedComment =
            await Comment.findById(
                comment._id
            ).populate(
                "user",
                "name email role"
            );

        res.status(201).json({
            message:
                "Comment added successfully",
            comment:
                populatedComment
        });
    } catch (error) {
        console.error(
            "Create comment error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to add comment",
            error:
                error.message
        });
    }
};

const getCommentsByReport =
    async (req, res) => {
        try {
            const comments =
                await Comment.find({
                    report:
                        req.params.reportId
                })
                    .populate(
                        "user",
                        "name email role"
                    )
                    .sort({
                        createdAt: 1
                    });

            res.status(200).json({
                count:
                    comments.length,
                comments
            });
        } catch (error) {
            console.error(
                "Get comments error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch comments",
                error:
                    error.message
            });
        }
    };

const deleteComment =
    async (req, res) => {
        try {
            const comment =
                await Comment.findById(
                    req.params.id
                );

            if (!comment) {
                return res.status(404).json({
                    message:
                        "Comment not found"
                });
            }

            const isOwner =
                comment.user.toString() ===
                req.user._id.toString();

            const isAdmin =
                req.user.role === "admin";

            if (
                !isOwner &&
                !isAdmin
            ) {
                return res.status(403).json({
                    message:
                        "You can only delete your own comments."
                });
            }

            await Comment.findByIdAndDelete(
                req.params.id
            );

            res.status(200).json({
                message:
                    "Comment deleted successfully"
            });
        } catch (error) {
            console.error(
                "Delete comment error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to delete comment",
                error:
                    error.message
            });
        }
    };

module.exports = {
    createComment,
    getCommentsByReport,
    deleteComment
};