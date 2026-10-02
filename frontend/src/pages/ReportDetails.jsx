import { useEffect, useState } from "react";
import axios from "axios";

function ReportDetails({
    report,
    onBack
}) {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] =
        useState("");
    const [loadingComments, setLoadingComments] =
        useState(true);
    const [submittingComment, setSubmittingComment] =
        useState(false);
    const [commentError, setCommentError] =
        useState("");

    const getEvidenceImageUrl = (
        imagePath
    ) => {
        if (!imagePath) {
            return "";
        }

        if (
            imagePath.startsWith("http://") ||
            imagePath.startsWith("https://")
        ) {
            return imagePath;
        }

        if (imagePath.startsWith("/")) {
            return `http://localhost:5000${imagePath}`;
        }

        return `http://localhost:5000/${imagePath}`;
    };

    const loadComments = async () => {
        if (!report?._id) {
            return;
        }

        try {
            setLoadingComments(true);
            setCommentError("");

            const response =
                await axios.get(
                    `http://localhost:5000/api/comments/report/${report._id}`
                );

            setComments(
                response.data.comments || []
            );
        } catch (error) {
            console.error(
                "Failed to load comments:",
                error
            );

            setCommentError(
                error.response?.data?.message ||
                "Failed to load comments."
            );
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [report?._id]);

    const handleSubmitComment = async (
        event
    ) => {
        event.preventDefault();

        if (!commentText.trim()) {
            setCommentError(
                "Please enter a comment."
            );
            return;
        }

        if (commentText.trim().length > 500) {
            setCommentError(
                "Comment cannot exceed 500 characters."
            );
            return;
        }

        try {
            setSubmittingComment(true);
            setCommentError("");

            await axios.post(
                "http://localhost:5000/api/comments",
                {
                    report: report._id,
                    text: commentText.trim()
                }
            );

            setCommentText("");

            await loadComments();
        } catch (error) {
            console.error(
                "Failed to add comment:",
                error
            );

            setCommentError(
                error.response?.data?.message ||
                "Failed to add comment."
            );
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (
        commentId
    ) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this comment?"
            );

        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/api/comments/${commentId}`
            );

            await loadComments();
        } catch (error) {
            console.error(
                "Failed to delete comment:",
                error
            );

            setCommentError(
                error.response?.data?.message ||
                "Failed to delete comment."
            );
        }
    };

    if (!report) {
        return (
            <div style={styles.page}>
                <div style={styles.emptyCard}>
                    <h2>
                        Report not found
                    </h2>

                    <button
                        onClick={onBack}
                        style={styles.backButton}
                    >
                        ← Back
                    </button>
                </div>
            </div>
        );
    }

    const reportDate =
        report.createdAt
            ? new Date(
                report.createdAt
            ).toLocaleString()
            : "Date unavailable";

    const status =
        report.status || "Pending";

    const severity =
        report.severity || "Medium";

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <button
                    onClick={onBack}
                    style={styles.backButton}
                >
                    ← Back to Reports
                </button>

                <div style={styles.headerCard}>
                    <div>
                        <div style={styles.icon}>
                            💧
                        </div>

                        <h1
                            style={
                                styles.title
                            }
                        >
                            Pollution Report
                        </h1>

                        <p
                            style={
                                styles.subtitle
                            }
                        >
                            Community freshwater
                            monitoring report
                        </p>
                    </div>

                    <div
                        style={
                            styles.badgeContainer
                        }
                    >
                        <span
                            style={{
                                ...styles.statusBadge,
                                backgroundColor:
                                    status ===
                                        "Verified"
                                        ? "#e8f5e9"
                                        : status ===
                                            "Rejected"
                                            ? "#ffebee"
                                            : "#fff8e1",
                                color:
                                    status ===
                                        "Verified"
                                        ? "#2e7d32"
                                        : status ===
                                            "Rejected"
                                            ? "#c62828"
                                            : "#f57f17"
                            }}
                        >
                            {status}
                        </span>

                        <span
                            style={{
                                ...styles.severityBadge,
                                backgroundColor:
                                    severity ===
                                        "Critical" ||
                                        severity ===
                                        "High"
                                        ? "#ffebee"
                                        : severity ===
                                            "Medium"
                                            ? "#fff8e1"
                                            : "#e8f5e9",
                                color:
                                    severity ===
                                        "Critical" ||
                                        severity ===
                                        "High"
                                        ? "#c62828"
                                        : severity ===
                                            "Medium"
                                            ? "#f57f17"
                                            : "#2e7d32"
                            }}
                        >
                            {severity} Risk
                        </span>
                    </div>
                </div>

                <div style={styles.grid}>
                    <div style={styles.card}>
                        <h2
                            style={
                                styles.sectionTitle
                            }
                        >
                            Report Information
                        </h2>

                        <div
                            style={
                                styles.infoRow
                            }
                        >
                            <strong>
                                Water Body
                            </strong>

                            <span>
                                {report.waterBody
                                    ?.name ||
                                    "Unknown"}
                            </span>
                        </div>

                        <div
                            style={
                                styles.infoRow
                            }
                        >
                            <strong>
                                Type
                            </strong>

                            <span>
                                {report.waterBody
                                    ?.type ||
                                    "Not specified"}
                            </span>
                        </div>

                        <div
                            style={
                                styles.infoRow
                            }
                        >
                            <strong>
                                Pollution Type
                            </strong>

                            <span>
                                {report.pollutionType ||
                                    "Not specified"}
                            </span>
                        </div>

                        <div
                            style={
                                styles.infoRow
                            }
                        >
                            <strong>
                                Reported By
                            </strong>

                            <span>
                                {report.reportedBy
                                    ?.name ||
                                    "Community Member"}
                            </span>
                        </div>

                        <div
                            style={
                                styles.infoRow
                            }
                        >
                            <strong>
                                Date Reported
                            </strong>

                            <span>
                                {reportDate}
                            </span>
                        </div>
                    </div>

                    <div style={styles.card}>
                        <h2
                            style={
                                styles.sectionTitle
                            }
                        >
                            Location
                        </h2>

                        {report.waterBody
                            ?.location
                            ?.address && (
                                <p
                                    style={
                                        styles.locationText
                                    }
                                >
                                    📍{" "}
                                    {
                                        report
                                            .waterBody
                                            .location
                                            .address
                                    }
                                </p>
                            )}

                        {report.location
                            ?.latitude !==
                            null &&
                            report.location
                                ?.latitude !==
                            undefined && (
                                <div
                                    style={
                                        styles.coordinates
                                    }
                                >
                                    <strong>
                                        Coordinates
                                    </strong>

                                    <div>
                                        Latitude:{" "}
                                        {
                                            report
                                                .location
                                                .latitude
                                        }
                                    </div>

                                    <div>
                                        Longitude:{" "}
                                        {
                                            report
                                                .location
                                                .longitude
                                        }
                                    </div>
                                </div>
                            )}

                        {!report.waterBody
                            ?.location
                            ?.address &&
                            !report.location
                                ?.latitude && (
                                <p
                                    style={
                                        styles.mutedText
                                    }
                                >
                                    Location
                                    information
                                    not available.
                                </p>
                            )}
                    </div>
                </div>

                <div style={styles.card}>
                    <h2
                        style={
                            styles.sectionTitle
                        }
                    >
                        Pollution Description
                    </h2>

                    <p
                        style={
                            styles.description
                        }
                    >
                        {report.description ||
                            "No description provided."}
                    </p>
                </div>

                {report.evidenceImage && (
                    <div style={styles.card}>
                        <h2
                            style={
                                styles.sectionTitle
                            }
                        >
                            Evidence Photo
                        </h2>

                        <img
                            src={getEvidenceImageUrl(
                                report.evidenceImage
                            )}
                            alt="Pollution evidence"
                            style={
                                styles.evidenceImage
                            }
                        />
                    </div>
                )}

                {/* COMMUNITY COMMENTS */}
                <div style={styles.card}>
                    <div
                        style={
                            styles.commentsHeader
                        }
                    >
                        <div>
                            <h2
                                style={
                                    styles.sectionTitle
                                }
                            >
                                Community Comments
                            </h2>

                            <p
                                style={
                                    styles.commentsSubtitle
                                }
                            >
                                Share observations or
                                useful information about
                                this report.
                            </p>
                        </div>

                        <div
                            style={
                                styles.commentCount
                            }
                        >
                            {comments.length}
                        </div>
                    </div>

                    {commentError && (
                        <div
                            style={
                                styles.commentError
                            }
                        >
                            ⚠️ {commentError}
                        </div>
                    )}

                    <form
                        onSubmit={
                            handleSubmitComment
                        }
                        style={
                            styles.commentForm
                        }
                    >
                        <textarea
                            value={commentText}
                            onChange={(event) =>
                                setCommentText(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Add a community observation or comment..."
                            maxLength={500}
                            style={
                                styles.commentInput
                            }
                        />

                        <div
                            style={
                                styles.commentFormFooter
                            }
                        >
                            <span
                                style={
                                    styles.characterCount
                                }
                            >
                                {commentText.length}
                                /500
                            </span>

                            <button
                                type="submit"
                                disabled={
                                    submittingComment
                                }
                                style={{
                                    ...styles.commentButton,
                                    opacity:
                                        submittingComment
                                            ? 0.7
                                            : 1
                                }}
                            >
                                {submittingComment
                                    ? "Posting..."
                                    : "Post Comment"}
                            </button>
                        </div>
                    </form>

                    <div
                        style={
                            styles.commentsList
                        }
                    >
                        {loadingComments ? (
                            <p
                                style={
                                    styles.mutedText
                                }
                            >
                                Loading comments...
                            </p>
                        ) : comments.length ===
                            0 ? (
                            <div
                                style={
                                    styles.noComments
                                }
                            >
                                <div
                                    style={
                                        styles.noCommentsIcon
                                    }
                                >
                                    💬
                                </div>

                                <strong>
                                    No comments yet
                                </strong>

                                <p
                                    style={
                                        styles.mutedText
                                    }
                                >
                                    Be the first community
                                    member to share an
                                    observation.
                                </p>
                            </div>
                        ) : (
                            comments.map(
                                (comment) => (
                                    <div
                                        key={
                                            comment._id
                                        }
                                        style={
                                            styles.commentItem
                                        }
                                    >
                                        <div
                                            style={
                                                styles.commentAvatar
                                            }
                                        >
                                            {comment.user
                                                ?.name
                                                ?.charAt(
                                                    0
                                                )
                                                ?.toUpperCase() ||
                                                "U"}
                                        </div>

                                        <div
                                            style={
                                                styles.commentContent
                                            }
                                        >
                                            <div
                                                style={
                                                    styles.commentTop
                                                }
                                            >
                                                <strong>
                                                    {comment
                                                        .user
                                                        ?.name ||
                                                        "Community Member"}
                                                </strong>

                                                <span
                                                    style={
                                                        styles.commentDate
                                                    }
                                                >
                                                    {comment.createdAt
                                                        ? new Date(
                                                            comment.createdAt
                                                        ).toLocaleString()
                                                        : ""}
                                                </span>
                                            </div>

                                            <p
                                                style={
                                                    styles.commentText
                                                }
                                            >
                                                {
                                                    comment.text
                                                }
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteComment(
                                                        comment._id
                                                    )
                                                }
                                                style={
                                                    styles.deleteCommentButton
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f4f8f7",
        padding: "30px",
        fontFamily:
            "Arial, Helvetica, sans-serif",
        boxSizing: "border-box"
    },

    container: {
        maxWidth: "1000px",
        margin: "0 auto"
    },

    backButton: {
        border: "none",
        backgroundColor: "transparent",
        color: "#087f5b",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer",
        padding: "5px 0",
        marginBottom: "15px"
    },

    headerCard: {
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        padding: "25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        boxShadow:
            "0 4px 18px rgba(0, 0, 0, 0.06)",
        marginBottom: "20px"
    },

    icon: {
        fontSize: "35px",
        marginBottom: "5px"
    },

    title: {
        margin: 0,
        color: "#155e75",
        fontSize: "27px"
    },

    subtitle: {
        margin: "6px 0 0 0",
        color: "#78909c",
        fontSize: "14px"
    },

    badgeContainer: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        justifyContent: "flex-end"
    },

    statusBadge: {
        padding: "7px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700"
    },

    severityBadge: {
        padding: "7px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700"
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        marginBottom: "20px"
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        padding: "24px",
        boxShadow:
            "0 4px 18px rgba(0, 0, 0, 0.06)",
        marginBottom: "20px"
    },

    sectionTitle: {
        margin: "0 0 15px 0",
        color: "#263238",
        fontSize: "19px"
    },

    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
        padding: "11px 0",
        borderBottom:
            "1px solid #eceff1",
        fontSize: "14px",
        color: "#546e7a"
    },

    locationText: {
        color: "#455a64",
        fontSize: "14px",
        lineHeight: "1.6"
    },

    coordinates: {
        backgroundColor: "#f5f7f8",
        padding: "14px",
        borderRadius: "8px",
        color: "#607d8b",
        fontSize: "13px",
        lineHeight: "1.8",
        marginTop: "15px"
    },

    description: {
        color: "#455a64",
        fontSize: "15px",
        lineHeight: "1.7",
        margin: 0,
        whiteSpace: "pre-wrap"
    },

    evidenceImage: {
        width: "100%",
        maxHeight: "500px",
        objectFit: "contain",
        borderRadius: "10px",
        backgroundColor: "#f5f5f5",
        display: "block"
    },

    commentsHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px"
    },

    commentsSubtitle: {
        color: "#78909c",
        fontSize: "13px",
        margin: "-8px 0 15px 0"
    },

    commentCount: {
        minWidth: "34px",
        height: "34px",
        borderRadius: "50%",
        backgroundColor: "#e0f2f1",
        color: "#087f5b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        fontSize: "14px"
    },

    commentError: {
        backgroundColor: "#ffebee",
        color: "#c62828",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "15px",
        fontSize: "13px"
    },

    commentForm: {
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        padding: "12px",
        marginBottom: "25px"
    },

    commentInput: {
        width: "100%",
        minHeight: "90px",
        resize: "vertical",
        border: "none",
        outline: "none",
        fontFamily:
            "Arial, Helvetica, sans-serif",
        fontSize: "14px",
        lineHeight: "1.5",
        boxSizing: "border-box"
    },

    commentFormFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop:
            "1px solid #eeeeee",
        paddingTop: "10px"
    },

    characterCount: {
        color: "#90a4ae",
        fontSize: "12px"
    },

    commentButton: {
        border: "none",
        backgroundColor: "#087f5b",
        color: "#ffffff",
        padding: "10px 17px",
        borderRadius: "7px",
        fontSize: "13px",
        fontWeight: "700",
        cursor: "pointer"
    },

    commentsList: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },

    commentItem: {
        display: "flex",
        gap: "12px",
        padding: "15px",
        backgroundColor: "#f8faf9",
        borderRadius: "10px"
    },

    commentAvatar: {
        width: "38px",
        height: "38px",
        minWidth: "38px",
        borderRadius: "50%",
        backgroundColor: "#087f5b",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        fontSize: "15px"
    },

    commentContent: {
        flex: 1,
        minWidth: 0
    },

    commentTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        marginBottom: "5px",
        color: "#37474f",
        fontSize: "13px"
    },

    commentDate: {
        color: "#90a4ae",
        fontSize: "11px"
    },

    commentText: {
        color: "#455a64",
        fontSize: "14px",
        lineHeight: "1.5",
        margin: "0 0 8px 0",
        whiteSpace: "pre-wrap"
    },

    deleteCommentButton: {
        border: "none",
        backgroundColor: "transparent",
        color: "#c62828",
        padding: 0,
        fontSize: "11px",
        cursor: "pointer"
    },

    noComments: {
        textAlign: "center",
        padding: "25px"
    },

    noCommentsIcon: {
        fontSize: "30px",
        marginBottom: "8px"
    },

    mutedText: {
        color: "#90a4ae",
        fontSize: "13px",
        lineHeight: "1.5"
    },

    emptyCard: {
        maxWidth: "500px",
        margin: "100px auto",
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "14px",
        textAlign: "center",
        boxShadow:
            "0 4px 18px rgba(0, 0, 0, 0.06)"
    }
};

export default ReportDetails;