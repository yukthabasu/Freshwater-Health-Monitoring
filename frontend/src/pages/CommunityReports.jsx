import { useEffect, useState } from "react";
import axios from "axios";

function CommunityReports({ onViewReport }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeFilter, setActiveFilter] =
        useState("All");

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/pollution-reports"
            );

            setReports(
                response.data.reports || []
            );
        } catch (error) {
            console.error(error);

            setError(
                "Unable to load community reports."
            );
        } finally {
            setLoading(false);
        }
    };

    const getSeverityStyle = (
        severity
    ) => {
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
                backgroundColor: "#fffde7",
                color: "#827717"
            };
        }

        return {
            backgroundColor: "#e8f5e9",
            color: "#2e7d32"
        };
    };

    const getStatusStyle = (
        status
    ) => {
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

    const filteredReports =
        reports.filter((report) => {
            if (activeFilter === "All") {
                return true;
            }

            if (
                activeFilter ===
                "High Risk"
            ) {
                return (
                    report.severity ===
                    "High" ||
                    report.severity ===
                    "Critical"
                );
            }

            return (
                report.status ===
                activeFilter
            );
        });

    const filterButtons = [
        {
            label: "All",
            count: reports.length
        },
        {
            label: "Pending",
            count: reports.filter(
                (report) =>
                    report.status ===
                    "Pending"
            ).length
        },
        {
            label: "Verified",
            count: reports.filter(
                (report) =>
                    report.status ===
                    "Verified"
            ).length
        },
        {
            label: "Rejected",
            count: reports.filter(
                (report) =>
                    report.status ===
                    "Rejected"
            ).length
        },
        {
            label: "High Risk",
            count: reports.filter(
                (report) =>
                    report.severity ===
                    "High" ||
                    report.severity ===
                    "Critical"
            ).length
        }
    ];

    return (
        <div>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>
                    Community Pollution
                    Reports
                </h1>

                <p
                    style={
                        styles.subtitle
                    }
                >
                    Explore pollution
                    observations submitted
                    by community members
                    across freshwater
                    bodies.
                </p>
            </div>

            {/* Summary */}
            <div
                style={
                    styles.summaryGrid
                }
            >
                <div
                    style={
                        styles.summaryCard
                    }
                >
                    <div
                        style={
                            styles.summaryNumber
                        }
                    >
                        {reports.length}
                    </div>

                    <div
                        style={
                            styles.summaryLabel
                        }
                    >
                        Total Reports
                    </div>
                </div>

                <div
                    style={
                        styles.summaryCard
                    }
                >
                    <div
                        style={
                            styles.summaryNumber
                        }
                    >
                        {
                            reports.filter(
                                (report) =>
                                    report.status ===
                                    "Verified"
                            ).length
                        }
                    </div>

                    <div
                        style={
                            styles.summaryLabel
                        }
                    >
                        Verified
                    </div>
                </div>

                <div
                    style={
                        styles.summaryCard
                    }
                >
                    <div
                        style={
                            styles.summaryNumber
                        }
                    >
                        {
                            reports.filter(
                                (report) =>
                                    report.status ===
                                    "Pending"
                            ).length
                        }
                    </div>

                    <div
                        style={
                            styles.summaryLabel
                        }
                    >
                        Pending
                    </div>
                </div>

                <div
                    style={
                        styles.summaryCard
                    }
                >
                    <div
                        style={
                            styles.summaryNumber
                        }
                    >
                        {
                            reports.filter(
                                (report) =>
                                    report.severity ===
                                    "High" ||
                                    report.severity ===
                                    "Critical"
                            ).length
                        }
                    </div>

                    <div
                        style={
                            styles.summaryLabel
                        }
                    >
                        High Risk
                    </div>
                </div>
            </div>

            {/* Filters */}
            {!loading &&
                reports.length > 0 && (
                    <div
                        style={
                            styles.filterSection
                        }
                    >
                        <div
                            style={
                                styles.filterTitle
                            }
                        >
                            Filter Reports
                        </div>

                        <div
                            style={
                                styles.filterContainer
                            }
                        >
                            {filterButtons.map(
                                (filter) => (
                                    <button
                                        key={
                                            filter.label
                                        }
                                        onClick={() =>
                                            setActiveFilter(
                                                filter.label
                                            )
                                        }
                                        style={{
                                            ...styles.filterButton,
                                            ...(activeFilter ===
                                                filter.label
                                                ? styles.activeFilterButton
                                                : {})
                                        }}
                                    >
                                        {
                                            filter.label
                                        }

                                        <span
                                            style={{
                                                ...styles.filterCount,
                                                ...(activeFilter ===
                                                    filter.label
                                                    ? styles.activeFilterCount
                                                    : {})
                                            }}
                                        >
                                            {
                                                filter.count
                                            }
                                        </span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                )}

            {/* Error */}
            {error && (
                <div
                    style={
                        styles.error
                    }
                >
                    ⚠️ {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div
                    style={
                        styles.message
                    }
                >
                    Loading community
                    reports...
                </div>
            )}

            {/* Empty */}
            {!loading &&
                reports.length ===
                0 && (
                    <div
                        style={
                            styles.empty
                        }
                    >
                        <div
                            style={
                                styles.emptyIcon
                            }
                        >
                            🌊
                        </div>

                        <h2>
                            No pollution
                            reports yet
                        </h2>

                        <p>
                            Community
                            pollution
                            observations
                            will appear
                            here when
                            submitted.
                        </p>
                    </div>
                )}

            {/* No filtered results */}
            {!loading &&
                reports.length >
                0 &&
                filteredReports.length ===
                0 && (
                    <div
                        style={
                            styles.empty
                        }
                    >
                        <div
                            style={
                                styles.emptyIcon
                            }
                        >
                            🔎
                        </div>

                        <h2>
                            No matching
                            reports
                        </h2>

                        <p>
                            There are no
                            reports under
                            the{" "}
                            <strong>
                                {
                                    activeFilter
                                }
                            </strong>{" "}
                            filter.
                        </p>
                    </div>
                )}

            {/* Reports */}
            {!loading &&
                filteredReports.length >
                0 && (
                    <div
                        style={
                            styles.reportGrid
                        }
                    >
                        {filteredReports.map(
                            (report) => (
                                <div
                                    key={
                                        report._id
                                    }
                                    style={
                                        styles.reportCard
                                    }
                                >
                                    <div
                                        style={
                                            styles.cardHeader
                                        }
                                    >
                                        <div>
                                            <h2
                                                style={
                                                    styles.reportTitle
                                                }
                                            >
                                                {
                                                    report.pollutionType
                                                }
                                            </h2>

                                            <p
                                                style={
                                                    styles.waterBody
                                                }
                                            >
                                                🌊{" "}
                                                {report
                                                    .waterBody
                                                    ?.name ||
                                                    "Unknown water body"}
                                            </p>
                                        </div>

                                        <span
                                            style={{
                                                ...styles.badge,
                                                ...getSeverityStyle(
                                                    report.severity
                                                )
                                            }}
                                        >
                                            {
                                                report.severity
                                            }
                                        </span>
                                    </div>

                                    <p
                                        style={
                                            styles.description
                                        }
                                    >
                                        {
                                            report.description
                                        }
                                    </p>

                                    <div
                                        style={
                                            styles.details
                                        }
                                    >
                                        <div
                                            style={
                                                styles.detailRow
                                            }
                                        >
                                            <strong>
                                                📍
                                                Location
                                            </strong>

                                            <span>
                                                {report
                                                    .waterBody
                                                    ?.location
                                                    ?.address ||
                                                    "Location not available"}
                                            </span>
                                        </div>

                                        <div
                                            style={
                                                styles.detailRow
                                            }
                                        >
                                            <strong>
                                                👤
                                                Reported
                                                by
                                            </strong>

                                            <span>
                                                {report
                                                    .reportedBy
                                                    ?.name ||
                                                    "Community member"}
                                            </span>
                                        </div>

                                        <div
                                            style={
                                                styles.detailRow
                                            }
                                        >
                                            <strong>
                                                📅
                                                Reported
                                                on
                                            </strong>

                                            <span>
                                                {report.createdAt
                                                    ? new Date(
                                                        report.createdAt
                                                    ).toLocaleDateString()
                                                    : "Date unavailable"}
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        style={
                                            styles.cardFooter
                                        }
                                    >
                                        <span
                                            style={{
                                                ...styles.statusBadge,
                                                ...getStatusStyle(
                                                    report.status
                                                )
                                            }}
                                        >
                                            {
                                                report.status
                                            }
                                        </span>

                                        <button
                                            type="button"
                                            style={
                                                styles.detailsButton
                                            }
                                            onClick={() => {
                                                if (
                                                    onViewReport
                                                ) {
                                                    onViewReport(
                                                        report
                                                    );
                                                }
                                            }}
                                        >
                                            View
                                            Details
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
        </div>
    );
}

const styles = {
    header: {
        marginBottom: "30px"
    },

    title: {
        margin: "0 0 8px 0",
        color: "#155e75",
        fontSize: "32px"
    },

    subtitle: {
        margin: 0,
        color: "#607d8b",
        fontSize: "16px",
        lineHeight: "1.6"
    },

    summaryGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "18px",
        marginBottom: "25px"
    },

    summaryCard: {
        backgroundColor: "#ffffff",
        padding: "22px",
        borderRadius: "12px",
        boxShadow:
            "0 3px 12px rgba(0, 0, 0, 0.07)"
    },

    summaryNumber: {
        color: "#087f5b",
        fontSize: "30px",
        fontWeight: "700",
        marginBottom: "5px"
    },

    summaryLabel: {
        color: "#607d8b",
        fontSize: "14px"
    },

    filterSection: {
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "25px",
        boxShadow:
            "0 3px 12px rgba(0, 0, 0, 0.06)"
    },

    filterTitle: {
        fontSize: "15px",
        fontWeight: "700",
        color: "#37474f",
        marginBottom: "13px"
    },

    filterContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px"
    },

    filterButton: {
        backgroundColor: "#f1f5f4",
        color: "#455a64",
        border:
            "1px solid #d7e2df",
        padding: "9px 14px",
        borderRadius: "20px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },

    activeFilterButton: {
        backgroundColor: "#087f5b",
        color: "#ffffff",
        border:
            "1px solid #087f5b"
    },

    filterCount: {
        backgroundColor: "#ffffff",
        color: "#455a64",
        borderRadius: "12px",
        minWidth: "20px",
        height: "20px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: "700"
    },

    activeFilterCount: {
        backgroundColor: "#ffffff",
        color: "#087f5b"
    },

    reportGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "22px"
    },

    reportCard: {
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        padding: "22px",
        boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.08)"
    },

    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "15px",
        marginBottom: "15px"
    },

    reportTitle: {
        margin: "0 0 7px 0",
        color: "#263238",
        fontSize: "20px"
    },

    waterBody: {
        margin: 0,
        color: "#087f5b",
        fontWeight: "600"
    },

    badge: {
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700",
        whiteSpace: "nowrap"
    },

    description: {
        color: "#455a64",
        lineHeight: "1.6",
        fontSize: "14px",
        minHeight: "65px"
    },

    details: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "15px 0",
        borderTop:
            "1px solid #eceff1",
        borderBottom:
            "1px solid #eceff1"
    },

    detailRow: {
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        fontSize: "13px",
        color: "#546e7a"
    },

    cardFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "17px"
    },

    statusBadge: {
        padding: "6px 11px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700"
    },

    detailsButton: {
        backgroundColor: "#087f5b",
        color: "#ffffff",
        border: "none",
        padding: "9px 14px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600"
    },

    message: {
        textAlign: "center",
        padding: "40px",
        color: "#607d8b"
    },

    empty: {
        backgroundColor: "#ffffff",
        padding: "50px",
        textAlign: "center",
        borderRadius: "14px"
    },

    emptyIcon: {
        fontSize: "45px"
    },

    error: {
        backgroundColor: "#ffebee",
        color: "#c62828",
        padding: "14px",
        borderRadius: "8px",
        marginBottom: "20px"
    }
};

export default CommunityReports;