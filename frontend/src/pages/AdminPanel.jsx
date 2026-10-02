import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [waterBodies, setWaterBodies] = useState([]);
    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);
    const [updatingReport, setUpdatingReport] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadAdminData();
    }, []);

    const loadAdminData = async () => {
        try {
            setLoading(true);
            setError("");

            const waterBodyResponse = await axios.get(
                `${API_URL}/water-bodies`
            );

            const reportResponse = await axios.get(
                `${API_URL}/pollution-reports`
            );

            setWaterBodies(
                waterBodyResponse.data.waterBodies || []
            );

            setReports(
                reportResponse.data.reports || []
            );

            setUsers([
                {
                    _id: "current-user",
                    name: "Yuktha",
                    email: "yuktha.test@gmail.com",
                    role: "citizen",
                    location: "Bengaluru"
                }
            ]);
        } catch (err) {
            console.error("Admin data error:", err);

            setError(
                "Unable to load admin dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    const updateReportStatus = async (
        reportId,
        newStatus
    ) => {
        console.log(
            "Updating report:",
            reportId,
            "to:",
            newStatus
        );

        try {
            setUpdatingReport(reportId);
            setMessage("");
            setError("");

            const response = await axios.put(
                `${API_URL}/pollution-reports/${reportId}/status`,
                {
                    status: newStatus
                }
            );

            console.log(
                "Status update response:",
                response.data
            );

            if (response.data.report) {
                setMessage(
                    `Report successfully marked as ${newStatus}.`
                );

                await loadAdminData();
            } else {
                setError(
                    "The server did not return the updated report."
                );
            }
        } catch (err) {
            console.error(
                "Status update error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to update report status."
            );
        } finally {
            setUpdatingReport(null);
        }
    };

    const totalReports = reports.length;

    const pendingReports = reports.filter(
        (report) =>
            report.status === "Pending"
    ).length;

    const verifiedReports = reports.filter(
        (report) =>
            report.status === "Verified"
    ).length;

    const rejectedReports = reports.filter(
        (report) =>
            report.status === "Rejected"
    ).length;

    const highRiskReports = reports.filter(
        (report) =>
            report.severity === "High" ||
            report.severity === "Critical"
    ).length;

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

    if (loading) {
        return (
            <div style={styles.loading}>
                Loading Admin Panel...
            </div>
        );
    }

    return (
        <div>

            {/* HEADER */}
            <div style={styles.header}>
                <h1 style={styles.title}>
                    🛠️ Admin Panel
                </h1>

                <p style={styles.subtitle}>
                    Manage freshwater monitoring data,
                    users and pollution reports.
                </p>
            </div>


            {/* SUCCESS MESSAGE */}
            {message && (
                <div style={styles.successMessage}>
                    ✅ {message}
                </div>
            )}


            {/* ERROR MESSAGE */}
            {error && (
                <div style={styles.errorMessage}>
                    ⚠️ {error}
                </div>
            )}


            {/* STATISTICS */}
            <div style={styles.statsGrid}>

                <div style={styles.statCard}>
                    <div style={styles.statIcon}>
                        👥
                    </div>

                    <div style={styles.statNumber}>
                        {users.length}
                    </div>

                    <div style={styles.statLabel}>
                        Community Users
                    </div>
                </div>


                <div style={styles.statCard}>
                    <div style={styles.statIcon}>
                        🌊
                    </div>

                    <div style={styles.statNumber}>
                        {waterBodies.length}
                    </div>

                    <div style={styles.statLabel}>
                        Water Bodies
                    </div>
                </div>


                <div style={styles.statCard}>
                    <div style={styles.statIcon}>
                        📋
                    </div>

                    <div style={styles.statNumber}>
                        {totalReports}
                    </div>

                    <div style={styles.statLabel}>
                        Total Reports
                    </div>
                </div>


                <div style={styles.statCard}>
                    <div style={styles.statIcon}>
                        ⏳
                    </div>

                    <div style={styles.statNumber}>
                        {pendingReports}
                    </div>

                    <div style={styles.statLabel}>
                        Pending Reports
                    </div>
                </div>


                <div style={styles.statCard}>
                    <div style={styles.statIcon}>
                        ✅
                    </div>

                    <div style={styles.statNumber}>
                        {verifiedReports}
                    </div>

                    <div style={styles.statLabel}>
                        Verified Reports
                    </div>
                </div>


                <div style={styles.statCard}>
                    <div style={styles.statIcon}>
                        ⚠️
                    </div>

                    <div style={styles.statNumber}>
                        {highRiskReports}
                    </div>

                    <div style={styles.statLabel}>
                        High Risk Reports
                    </div>
                </div>

            </div>


            {/* REPORT SUMMARY */}
            <div style={styles.section}>

                <h2 style={styles.sectionTitle}>
                    📊 Report Summary
                </h2>

                <div style={styles.summaryGrid}>

                    <div style={styles.summaryItem}>
                        <span>Pending</span>
                        <strong>{pendingReports}</strong>
                    </div>

                    <div style={styles.summaryItem}>
                        <span>Verified</span>
                        <strong>{verifiedReports}</strong>
                    </div>

                    <div style={styles.summaryItem}>
                        <span>Rejected</span>
                        <strong>{rejectedReports}</strong>
                    </div>

                    <div style={styles.summaryItem}>
                        <span>High Risk</span>
                        <strong>{highRiskReports}</strong>
                    </div>

                </div>
            </div>


            {/* WATER BODIES */}
            <div style={styles.section}>

                <h2 style={styles.sectionTitle}>
                    🌊 Monitored Water Bodies
                </h2>

                {waterBodies.length === 0 ? (
                    <div style={styles.empty}>
                        No water bodies have been added yet.
                    </div>
                ) : (
                    <div style={styles.waterBodyGrid}>

                        {waterBodies.map((waterBody) => (
                            <div
                                key={waterBody._id}
                                style={styles.waterBodyCard}
                            >

                                <h3>
                                    {waterBody.name}
                                </h3>

                                <p>
                                    🏞️ Type:{" "}
                                    <strong>
                                        {waterBody.type}
                                    </strong>
                                </p>

                                <p>
                                    📍{" "}
                                    {waterBody.location?.address}
                                </p>

                                <span style={styles.healthBadge}>
                                    {waterBody.healthStatus}
                                </span>

                            </div>
                        ))}

                    </div>
                )}

            </div>


            {/* POLLUTION REPORTS */}
            <div style={styles.section}>

                <div style={styles.sectionHeader}>

                    <h2 style={styles.sectionTitle}>
                        ⚠️ Pollution Reports
                    </h2>

                    <span style={styles.countBadge}>
                        {reports.length} report
                        {reports.length !== 1
                            ? "s"
                            : ""}
                    </span>

                </div>


                {reports.length === 0 ? (

                    <div style={styles.empty}>
                        No pollution reports available.
                    </div>

                ) : (

                    <div style={styles.reportList}>

                        {reports.map((report) => (

                            <div
                                key={report._id}
                                style={styles.reportCard}
                            >

                                {/* REPORT INFORMATION */}
                                <div style={styles.reportMain}>

                                    <h3 style={styles.reportTitle}>
                                        {report.pollutionType}
                                    </h3>

                                    <p style={styles.waterBodyName}>
                                        🌊{" "}
                                        {report.waterBody?.name ||
                                            "Unknown water body"}
                                    </p>

                                    <p style={styles.description}>
                                        {report.description}
                                    </p>

                                    <div style={styles.reportInfo}>

                                        <span>
                                            👤{" "}
                                            {report.reportedBy?.name ||
                                                "Unknown user"}
                                        </span>

                                        <span>
                                            📅{" "}
                                            {new Date(
                                                report.createdAt
                                            ).toLocaleDateString()}
                                        </span>

                                    </div>

                                </div>


                                {/* RIGHT SIDE */}
                                <div style={styles.reportActions}>

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


                                    {/* BUTTONS */}
                                    <div style={styles.actionButtons}>

                                        {report.status !==
                                            "Verified" && (

                                                <button
                                                    type="button"
                                                    className="admin-action-button"
                                                    style={
                                                        updatingReport ===
                                                            report._id
                                                            ? styles.disabledButton
                                                            : styles.verifyButton
                                                    }
                                                    disabled={
                                                        updatingReport ===
                                                        report._id
                                                    }
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        event.stopPropagation();

                                                        console.log(
                                                            "VERIFY CLICKED:",
                                                            report._id
                                                        );

                                                        updateReportStatus(
                                                            report._id,
                                                            "Verified"
                                                        );
                                                    }}
                                                >
                                                    {updatingReport ===
                                                        report._id
                                                        ? "Updating..."
                                                        : "✓ Verify Report"}
                                                </button>

                                            )}


                                        {report.status !==
                                            "Rejected" && (

                                                <button
                                                    type="button"
                                                    className="admin-action-button"
                                                    style={
                                                        updatingReport ===
                                                            report._id
                                                            ? styles.disabledButton
                                                            : styles.rejectButton
                                                    }
                                                    disabled={
                                                        updatingReport ===
                                                        report._id
                                                    }
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        event.stopPropagation();

                                                        console.log(
                                                            "REJECT CLICKED:",
                                                            report._id
                                                        );

                                                        updateReportStatus(
                                                            report._id,
                                                            "Rejected"
                                                        );
                                                    }}
                                                >
                                                    {updatingReport ===
                                                        report._id
                                                        ? "Updating..."
                                                        : "✕ Reject Report"}
                                                </button>

                                            )}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* COMMUNITY USERS */}
            <div style={styles.section}>

                <h2 style={styles.sectionTitle}>
                    👥 Community Users
                </h2>

                <div style={styles.userList}>

                    {users.map((user) => (

                        <div
                            key={user._id}
                            style={styles.userCard}
                        >

                            <div style={styles.userAvatar}>
                                {user.name
                                    ? user.name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "U"}
                            </div>

                            <div>

                                <h3 style={styles.userName}>
                                    {user.name}
                                </h3>

                                <p style={styles.userEmail}>
                                    {user.email}
                                </p>

                                <p style={styles.userLocation}>
                                    📍 {user.location}
                                </p>

                            </div>

                            <span style={styles.roleBadge}>
                                {user.role}
                            </span>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}


const styles = {

    loading: {
        backgroundColor: "#ffffff",
        padding: "60px",
        borderRadius: "14px",
        textAlign: "center",
        color: "#607d8b",
        fontSize: "18px"
    },

    header: {
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "16px",
        marginBottom: "25px",
        boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.06)"
    },

    title: {
        color: "#155e75",
        margin: 0,
        fontSize: "32px"
    },

    subtitle: {
        color: "#78909c",
        marginTop: "8px"
    },

    successMessage: {
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px",
        fontWeight: "600"
    },

    errorMessage: {
        backgroundColor: "#ffebee",
        color: "#c62828",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px",
        fontWeight: "600"
    },

    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(170px, 1fr))",
        gap: "18px",
        marginBottom: "25px"
    },

    statCard: {
        backgroundColor: "#ffffff",
        padding: "22px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.05)"
    },

    statIcon: {
        fontSize: "28px"
    },

    statNumber: {
        color: "#087f5b",
        fontSize: "30px",
        fontWeight: "700",
        marginTop: "8px"
    },

    statLabel: {
        color: "#607d8b",
        fontSize: "13px",
        marginTop: "5px"
    },

    section: {
        backgroundColor: "#ffffff",
        padding: "25px",
        borderRadius: "14px",
        marginBottom: "25px",
        boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.05)"
    },

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px"
    },

    sectionTitle: {
        color: "#155e75",
        marginTop: 0
    },

    countBadge: {
        backgroundColor: "#e0f2f1",
        color: "#087f5b",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600"
    },

    summaryGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "15px"
    },

    summaryItem: {
        backgroundColor: "#f8fbfa",
        padding: "18px",
        borderRadius: "9px",
        display: "flex",
        justifyContent: "space-between",
        color: "#546e7a"
    },

    waterBodyGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "18px"
    },

    waterBodyCard: {
        border: "1px solid #eceff1",
        padding: "18px",
        borderRadius: "10px"
    },

    healthBadge: {
        display: "inline-block",
        backgroundColor: "#fff8e1",
        color: "#f57f17",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700"
    },

    empty: {
        backgroundColor: "#f8fbfa",
        padding: "25px",
        borderRadius: "9px",
        color: "#607d8b",
        textAlign: "center"
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

    reportMain: {
        flex: 1,
        minWidth: "250px"
    },

    reportTitle: {
        margin: "0 0 5px 0",
        color: "#263238"
    },

    waterBodyName: {
        color: "#087f5b",
        fontWeight: "600"
    },

    description: {
        color: "#546e7a",
        lineHeight: "1.5"
    },

    reportInfo: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        color: "#78909c",
        fontSize: "13px"
    },

    reportActions: {
        minWidth: "210px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        alignItems: "stretch"
    },

    badges: {
        display: "flex",
        gap: "8px",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        flexWrap: "wrap"
    },

    badge: {
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700"
    },

    actionButtons: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "100%",
        position: "relative",
        zIndex: 10
    },

    verifyButton: {
        backgroundColor: "#2e7d32",
        color: "#ffffff",
        border: "2px solid #2e7d32",
        padding: "12px 14px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "14px",
        width: "100%",
        pointerEvents: "auto"
    },

    rejectButton: {
        backgroundColor: "#c62828",
        color: "#ffffff",
        border: "2px solid #c62828",
        padding: "12px 14px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "14px",
        width: "100%",
        pointerEvents: "auto"
    },

    disabledButton: {
        backgroundColor: "#b0bec5",
        color: "#ffffff",
        border: "2px solid #b0bec5",
        padding: "12px 14px",
        borderRadius: "7px",
        cursor: "not-allowed",
        fontWeight: "700",
        fontSize: "14px",
        width: "100%"
    },

    userList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },

    userCard: {
        border: "1px solid #eceff1",
        padding: "15px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        flexWrap: "wrap"
    },

    userAvatar: {
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        backgroundColor: "#087f5b",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        fontSize: "20px"
    },

    userName: {
        margin: 0,
        color: "#263238"
    },

    userEmail: {
        margin: "4px 0",
        color: "#607d8b",
        fontSize: "13px"
    },

    userLocation: {
        margin: 0,
        color: "#78909c",
        fontSize: "13px"
    },

    roleBadge: {
        marginLeft: "auto",
        backgroundColor: "#e0f2f1",
        color: "#087f5b",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700",
        textTransform: "capitalize"
    }
};

export default AdminPanel;