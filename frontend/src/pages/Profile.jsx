import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            // Load the test user used by the current project
            const loginResponse = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email: "yuktha.test@gmail.com",
                    password: "Test@12345"
                }
            );

            const loggedInUser =
                loginResponse.data.user ||
                loginResponse.data;

            setUser(loggedInUser);

            const userId =
                loggedInUser._id ||
                loggedInUser.id;

            // Load community reports
            const reportsResponse = await axios.get(
                "http://localhost:5000/api/pollution-reports"
            );

            const allReports =
                reportsResponse.data.reports || [];

            const myReports = allReports.filter(
                (report) =>
                    report.reportedBy?._id === userId
            );

            setReports(myReports);
        } catch (error) {
            console.error(error);
            setError(
                "Unable to load profile information."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.message}>
                Loading profile...
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.error}>
                ⚠️ {error}
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.avatar}>
                    {user?.name
                        ? user.name.charAt(0).toUpperCase()
                        : "U"}
                </div>

                <div>
                    <h1 style={styles.title}>
                        {user?.name || "User Profile"}
                    </h1>

                    <p style={styles.subtitle}>
                        Community member profile
                    </p>
                </div>
            </div>

            {/* Profile Information */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    👤 Personal Information
                </h2>

                <div style={styles.infoGrid}>
                    <div style={styles.infoCard}>
                        <span style={styles.label}>
                            Full Name
                        </span>

                        <strong>
                            {user?.name || "Not available"}
                        </strong>
                    </div>

                    <div style={styles.infoCard}>
                        <span style={styles.label}>
                            Email Address
                        </span>

                        <strong>
                            {user?.email || "Not available"}
                        </strong>
                    </div>

                    <div style={styles.infoCard}>
                        <span style={styles.label}>
                            Location
                        </span>

                        <strong>
                            {user?.location || "Not provided"}
                        </strong>
                    </div>

                    <div style={styles.infoCard}>
                        <span style={styles.label}>
                            Account Role
                        </span>

                        <strong style={styles.role}>
                            {user?.role || "citizen"}
                        </strong>
                    </div>
                </div>
            </div>

            {/* Contribution Summary */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    🌱 Community Contribution
                </h2>

                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>
                            {reports.length}
                        </div>

                        <div style={styles.statLabel}>
                            Reports Submitted
                        </div>
                    </div>

                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>
                            {
                                reports.filter(
                                    (report) =>
                                        report.status === "Verified"
                                ).length
                            }
                        </div>

                        <div style={styles.statLabel}>
                            Verified Reports
                        </div>
                    </div>

                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>
                            {
                                reports.filter(
                                    (report) =>
                                        report.status === "Pending"
                                ).length
                            }
                        </div>

                        <div style={styles.statLabel}>
                            Pending Reports
                        </div>
                    </div>
                </div>
            </div>

            {/* My Reports */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    📋 My Pollution Reports
                </h2>

                {reports.length === 0 ? (
                    <div style={styles.empty}>
                        <div style={styles.emptyIcon}>
                            🌊
                        </div>

                        <h3>
                            No reports submitted yet
                        </h3>

                        <p>
                            Your pollution observations will
                            appear here after you submit them.
                        </p>
                    </div>
                ) : (
                    <div style={styles.reportList}>
                        {reports.map((report) => (
                            <div
                                key={report._id}
                                style={styles.reportCard}
                            >
                                <div>
                                    <h3 style={styles.reportTitle}>
                                        {report.pollutionType}
                                    </h3>

                                    <p style={styles.waterBody}>
                                        🌊{" "}
                                        {report.waterBody?.name ||
                                            "Unknown water body"}
                                    </p>

                                    <p style={styles.description}>
                                        {report.description}
                                    </p>

                                    <p style={styles.date}>
                                        📅{" "}
                                        {new Date(
                                            report.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div style={styles.badges}>
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const getSeverityStyle = (severity) => {
    if (severity === "Critical") {
        return {
            backgroundColor: "#ffebee",
            color: "#c62828"
        };
    }

    if (severity === "High") {
        return {
            backgroundColor: "#fff3e0",
            color: "#e65100"
        };
    }

    if (severity === "Medium") {
        return {
            backgroundColor: "#fff8e1",
            color: "#827717"
        };
    }

    return {
        backgroundColor: "#e8f5e9",
        color: "#2e7d32"
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

const styles = {
    message: {
        backgroundColor: "#ffffff",
        padding: "50px",
        borderRadius: "14px",
        textAlign: "center",
        color: "#607d8b"
    },

    error: {
        backgroundColor: "#ffebee",
        color: "#c62828",
        padding: "20px",
        borderRadius: "10px"
    },

    header: {
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginBottom: "25px",
        boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.06)"
    },

    avatar: {
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        backgroundColor: "#087f5b",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "30px",
        fontWeight: "700"
    },

    title: {
        color: "#155e75",
        margin: 0,
        fontSize: "30px"
    },

    subtitle: {
        color: "#78909c",
        margin: "6px 0 0 0"
    },

    section: {
        backgroundColor: "#ffffff",
        padding: "25px",
        borderRadius: "14px",
        boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.05)",
        marginBottom: "25px"
    },

    sectionTitle: {
        color: "#155e75",
        marginTop: 0,
        marginBottom: "20px"
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "18px"
    },

    infoCard: {
        backgroundColor: "#f8fbfa",
        padding: "18px",
        borderRadius: "9px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        color: "#263238"
    },

    label: {
        color: "#78909c",
        fontSize: "13px"
    },

    role: {
        textTransform: "capitalize",
        color: "#087f5b"
    },

    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "18px"
    },

    statCard: {
        backgroundColor: "#f8fbfa",
        padding: "22px",
        borderRadius: "10px",
        textAlign: "center"
    },

    statNumber: {
        color: "#087f5b",
        fontSize: "32px",
        fontWeight: "700"
    },

    statLabel: {
        color: "#607d8b",
        fontSize: "14px",
        marginTop: "5px"
    },

    empty: {
        backgroundColor: "#f8fbfa",
        padding: "35px",
        textAlign: "center",
        borderRadius: "10px",
        color: "#607d8b"
    },

    emptyIcon: {
        fontSize: "40px"
    },

    reportList: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },

    reportCard: {
        border: "1px solid #eceff1",
        borderRadius: "10px",
        padding: "18px",
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
        flexWrap: "wrap"
    },

    reportTitle: {
        margin: "0 0 6px 0",
        color: "#263238"
    },

    waterBody: {
        color: "#087f5b",
        fontWeight: "600"
    },

    description: {
        color: "#546e7a",
        lineHeight: "1.5"
    },

    date: {
        color: "#78909c",
        fontSize: "13px"
    },

    badges: {
        display: "flex",
        gap: "8px",
        alignItems: "flex-start",
        flexWrap: "wrap"
    },

    badge: {
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700"
    }
};

export default Profile;