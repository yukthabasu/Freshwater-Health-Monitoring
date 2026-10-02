import { useEffect, useState } from "react";
import axios from "axios";

function WaterBodyDetails({ waterBody, onBack }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/pollution-reports"
            );

            const allReports =
                response.data.reports || [];

            const waterBodyReports =
                allReports.filter(
                    (report) =>
                        report.waterBody?._id ===
                        waterBody?._id
                );

            setReports(waterBodyReports);
        } catch (error) {
            console.error(error);
            setError(
                "Unable to load pollution history."
            );
        } finally {
            setLoading(false);
        }
    };

    const verifiedReports = reports.filter(
        (report) => report.status === "Verified"
    );

    const highRiskReports = reports.filter(
        (report) =>
            report.severity === "High" ||
            report.severity === "Critical"
    );

    const getSeverityStyle = (severity) => {
        if (severity === "Low") {
            return {
                backgroundColor: "#e8f5e9",
                color: "#2e7d32"
            };
        }

        if (severity === "Medium") {
            return {
                backgroundColor: "#fff8e1",
                color: "#f57f17"
            };
        }

        if (severity === "High") {
            return {
                backgroundColor: "#fff3e0",
                color: "#e65100"
            };
        }

        return {
            backgroundColor: "#ffebee",
            color: "#c62828"
        };
    };

    const getStatusStyle = (status) => {
        if (status === "Verified") {
            return {
                backgroundColor: "#e8f5e9",
                color: "#2e7d32"
            };
        }

        if (status === "Rejected") {
            return {
                backgroundColor: "#ffebee",
                color: "#c62828"
            };
        }

        return {
            backgroundColor: "#fff8e1",
            color: "#f57f17"
        };
    };

    const getHealthStyle = (status) => {
        if (status === "Good") {
            return {
                backgroundColor: "#e8f5e9",
                color: "#2e7d32"
            };
        }

        if (status === "Moderate") {
            return {
                backgroundColor: "#fff8e1",
                color: "#f57f17"
            };
        }

        if (status === "Poor") {
            return {
                backgroundColor: "#fff3e0",
                color: "#e65100"
            };
        }

        return {
            backgroundColor: "#ffebee",
            color: "#c62828"
        };
    };

    if (!waterBody) {
        return (
            <div style={styles.error}>
                Water body information is not available.
            </div>
        );
    }

    return (
        <div>
            {/* Back button */}
            <button
                onClick={onBack}
                style={styles.backButton}
            >
                ← Back to Map
            </button>

            {/* Header */}
            <div style={styles.headerCard}>
                <div>
                    <div style={styles.waterIcon}>
                        🌊
                    </div>

                    <h1 style={styles.title}>
                        {waterBody.name}
                    </h1>

                    <p style={styles.type}>
                        {waterBody.type}
                    </p>

                    <p style={styles.address}>
                        📍 {waterBody.location?.address}
                    </p>
                </div>

                <div>
                    <span
                        style={{
                            ...styles.healthBadge,
                            ...getHealthStyle(
                                waterBody.healthStatus
                            )
                        }}
                    >
                        {waterBody.healthStatus}
                    </span>
                </div>
            </div>

            {/* Description */}
            <div style={styles.descriptionCard}>
                <h2 style={styles.sectionTitle}>
                    About this Water Body
                </h2>

                <p style={styles.description}>
                    {waterBody.description ||
                        "This freshwater body is currently monitored by the community platform."}
                </p>
            </div>

            {/* Statistics */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>
                        ⚠️
                    </div>

                    <div style={styles.statNumber}>
                        {reports.length}
                    </div>

                    <div style={styles.statLabel}>
                        Total Reports
                    </div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statIcon}>
                        ✅
                    </div>

                    <div style={styles.statNumber}>
                        {verifiedReports.length}
                    </div>

                    <div style={styles.statLabel}>
                        Verified Reports
                    </div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statIcon}>
                        🔴
                    </div>

                    <div style={styles.statNumber}>
                        {highRiskReports.length}
                    </div>

                    <div style={styles.statLabel}>
                        High Risk Reports
                    </div>
                </div>
            </div>

            {/* Pollution history */}
            <div style={styles.historyCard}>
                <h2 style={styles.sectionTitle}>
                    Pollution Report History
                </h2>

                {loading ? (
                    <div style={styles.message}>
                        Loading pollution history...
                    </div>
                ) : error ? (
                    <div style={styles.error}>
                        {error}
                    </div>
                ) : reports.length === 0 ? (
                    <div style={styles.empty}>
                        No pollution reports have been
                        recorded for this water body yet.
                    </div>
                ) : (
                    <div>
                        {reports.map((report) => (
                            <div
                                key={report._id}
                                style={styles.reportCard}
                            >
                                <div
                                    style={
                                        styles.reportHeader
                                    }
                                >
                                    <div>
                                        <h3
                                            style={
                                                styles.reportTitle
                                            }
                                        >
                                            {report.pollutionType}
                                        </h3>

                                        <div
                                            style={
                                                styles.reportDate
                                            }
                                        >
                                            {new Date(
                                                report.createdAt
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                }
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        style={
                                            styles.badgeGroup
                                        }
                                    >
                                        <span
                                            style={{
                                                ...styles.badge,
                                                ...getSeverityStyle(
                                                    report.severity
                                                )
                                            }}
                                        >
                                            {report.severity}
                                        </span>

                                        <span
                                            style={{
                                                ...styles.badge,
                                                ...getStatusStyle(
                                                    report.status
                                                )
                                            }}
                                        >
                                            {report.status}
                                        </span>
                                    </div>
                                </div>

                                <p
                                    style={
                                        styles.reportDescription
                                    }
                                >
                                    {report.description}
                                </p>

                                <div
                                    style={
                                        styles.reportFooter
                                    }
                                >
                                    <span>
                                        👤{" "}
                                        {report.reportedBy
                                            ?.name ||
                                            "Community member"}
                                    </span>

                                    {report.evidenceImage && (
                                        <span>
                                            📷 Evidence attached
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    backButton: {
        backgroundColor: "#ffffff",
        color: "#155e75",
        border: "1px solid #b0bec5",
        padding: "9px 15px",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        marginBottom: "20px"
    },

    headerCard: {
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "14px",
        boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.07)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px"
    },

    waterIcon: {
        fontSize: "36px",
        marginBottom: "5px"
    },

    title: {
        margin: "0 0 5px 0",
        color: "#155e75",
        fontSize: "32px"
    },

    type: {
        margin: "0 0 8px 0",
        color: "#78909c",
        textTransform: "capitalize"
    },

    address: {
        margin: 0,
        color: "#546e7a"
    },

    healthBadge: {
        display: "inline-block",
        padding: "8px 15px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "700"
    },

    descriptionCard: {
        backgroundColor: "#ffffff",
        marginTop: "20px",
        padding: "25px",
        borderRadius: "14px",
        boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.06)"
    },

    sectionTitle: {
        margin: "0 0 15px 0",
        color: "#155e75",
        fontSize: "21px"
    },

    description: {
        margin: 0,
        color: "#546e7a",
        lineHeight: "1.7"
    },

    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "18px",
        marginTop: "20px"
    },

    statCard: {
        backgroundColor: "#ffffff",
        padding: "22px",
        borderRadius: "14px",
        textAlign: "center",
        boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.06)"
    },

    statIcon: {
        fontSize: "25px",
        marginBottom: "7px"
    },

    statNumber: {
        fontSize: "30px",
        fontWeight: "700",
        color: "#087f5b"
    },

    statLabel: {
        marginTop: "5px",
        color: "#607d8b",
        fontSize: "14px"
    },

    historyCard: {
        backgroundColor: "#ffffff",
        marginTop: "20px",
        padding: "25px",
        borderRadius: "14px",
        boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.06)"
    },

    reportCard: {
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        padding: "18px",
        marginBottom: "15px"
    },

    reportHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "15px"
    },

    reportTitle: {
        margin: 0,
        color: "#263238",
        fontSize: "17px"
    },

    reportDate: {
        marginTop: "5px",
        color: "#90a4ae",
        fontSize: "12px"
    },

    badgeGroup: {
        display: "flex",
        gap: "7px",
        flexWrap: "wrap"
    },

    badge: {
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700"
    },

    reportDescription: {
        color: "#546e7a",
        lineHeight: "1.6",
        margin: "14px 0"
    },

    reportFooter: {
        display: "flex",
        gap: "20px",
        color: "#78909c",
        fontSize: "12px",
        flexWrap: "wrap"
    },

    message: {
        textAlign: "center",
        padding: "40px",
        color: "#607d8b"
    },

    empty: {
        textAlign: "center",
        padding: "40px",
        color: "#607d8b",
        backgroundColor: "#f8fafb",
        borderRadius: "10px"
    },

    error: {
        backgroundColor: "#ffebee",
        color: "#c62828",
        padding: "20px",
        borderRadius: "10px"
    }
};

export default WaterBodyDetails;