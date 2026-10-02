import { useEffect, useState } from "react";
import axios from "axios";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icons in React/Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});

// Custom pollution marker icons
const createPollutionIcon = (severity) => {
    let color = "#2e7d32";

    if (severity === "Medium") {
        color = "#f57f17";
    }

    if (severity === "High") {
        color = "#e65100";
    }

    if (severity === "Critical") {
        color = "#c62828";
    }

    return L.divIcon({
        className: "",
        html: `
            <div style="
                width: 32px;
                height: 32px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.35);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 17px;
                font-weight: bold;
            ">
                !
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
};

function WaterBodyMap({ onViewDetails }) {
    const [waterBodies, setWaterBodies] = useState([]);
    const [pollutionReports, setPollutionReports] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMapData();
    }, []);

    const fetchMapData = async () => {
        try {
            const [waterBodyResponse, reportResponse] =
                await Promise.all([
                    axios.get(
                        "http://localhost:5000/api/water-bodies"
                    ),
                    axios.get(
                        "http://localhost:5000/api/pollution-reports"
                    )
                ]);

            setWaterBodies(
                waterBodyResponse.data.waterBodies || []
            );

            setPollutionReports(
                reportResponse.data.reports || []
            );
        } catch (error) {
            console.error(error);
            setError(
                "Unable to load water body and pollution map data."
            );
        } finally {
            setLoading(false);
        }
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

    if (loading) {
        return (
            <div style={styles.message}>
                🌊 Loading water body and pollution map...
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
            {/* Page heading */}
            <div style={styles.headingSection}>
                <h1 style={styles.title}>
                    Water Body Map
                </h1>

                <p style={styles.subtitle}>
                    Explore monitored freshwater bodies and
                    community-reported pollution locations.
                </p>
            </div>

            {/* Map */}
            <div style={styles.mapCard}>
                <MapContainer
                    center={[12.9817, 77.6286]}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={styles.map}
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Water body markers */}
                    {waterBodies.map((waterBody) => (
                        <Marker
                            key={`water-${waterBody._id}`}
                            position={[
                                waterBody.location.latitude,
                                waterBody.location.longitude
                            ]}
                        >
                            <Popup>
                                <div style={styles.popup}>
                                    <h3 style={styles.popupTitle}>
                                        🌊 {waterBody.name}
                                    </h3>

                                    <p>
                                        <strong>Type:</strong>{" "}
                                        {waterBody.type}
                                    </p>

                                    <p>
                                        <strong>Health:</strong>{" "}
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
                                    </p>

                                    <p style={styles.popupLocation}>
                                        📍 {waterBody.location.address}
                                    </p>

                                    <button
                                        onClick={() =>
                                            onViewDetails(waterBody)
                                        }
                                        style={styles.button}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Pollution report markers */}
                    {pollutionReports.map((report) => {
                        const latitude =
                            report.location?.latitude;

                        const longitude =
                            report.location?.longitude;

                        // Only display reports that contain
                        // valid coordinates.
                        if (
                            latitude === null ||
                            latitude === undefined ||
                            longitude === null ||
                            longitude === undefined
                        ) {
                            return null;
                        }

                        return (
                            <Marker
                                key={`report-${report._id}`}
                                position={[
                                    latitude,
                                    longitude
                                ]}
                                icon={createPollutionIcon(
                                    report.severity
                                )}
                            >
                                <Popup>
                                    <div style={styles.popup}>
                                        <h3
                                            style={
                                                styles.pollutionTitle
                                            }
                                        >
                                            ⚠️ Pollution Report
                                        </h3>

                                        <p>
                                            <strong>
                                                Water Body:
                                            </strong>{" "}
                                            {report.waterBody?.name ||
                                                "Unknown"}
                                        </p>

                                        <p>
                                            <strong>
                                                Pollution:
                                            </strong>{" "}
                                            {report.pollutionType}
                                        </p>

                                        <p>
                                            <strong>
                                                Severity:
                                            </strong>{" "}
                                            <span
                                                style={{
                                                    ...styles.healthBadge,
                                                    ...getSeverityStyle(
                                                        report.severity
                                                    )
                                                }}
                                            >
                                                {report.severity}
                                            </span>
                                        </p>

                                        <p>
                                            <strong>
                                                Status:
                                            </strong>{" "}
                                            <span
                                                style={{
                                                    ...styles.healthBadge,
                                                    ...getStatusStyle(
                                                        report.status
                                                    )
                                                }}
                                            >
                                                {report.status}
                                            </span>
                                        </p>

                                        <p
                                            style={
                                                styles.description
                                            }
                                        >
                                            <strong>
                                                Description:
                                            </strong>{" "}
                                            {report.description}
                                        </p>

                                        <p
                                            style={
                                                styles.popupLocation
                                            }
                                        >
                                            📍 Reported pollution
                                            location
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

            {/* Map Legend */}
            <div style={styles.legendCard}>
                <h3 style={styles.legendTitle}>
                    Map Legend
                </h3>

                <div style={styles.legendItems}>
                    <div style={styles.legendItem}>
                        <span style={styles.waterLegendMarker}>
                            🌊
                        </span>

                        <span>
                            Monitored Water Body
                        </span>
                    </div>

                    <div style={styles.legendItem}>
                        <span
                            style={{
                                ...styles.pollutionLegendMarker,
                                backgroundColor: "#2e7d32"
                            }}
                        >
                            !
                        </span>

                        <span>
                            Low Pollution
                        </span>
                    </div>

                    <div style={styles.legendItem}>
                        <span
                            style={{
                                ...styles.pollutionLegendMarker,
                                backgroundColor: "#f57f17"
                            }}
                        >
                            !
                        </span>

                        <span>
                            Medium Pollution
                        </span>
                    </div>

                    <div style={styles.legendItem}>
                        <span
                            style={{
                                ...styles.pollutionLegendMarker,
                                backgroundColor: "#e65100"
                            }}
                        >
                            !
                        </span>

                        <span>
                            High Pollution
                        </span>
                    </div>

                    <div style={styles.legendItem}>
                        <span
                            style={{
                                ...styles.pollutionLegendMarker,
                                backgroundColor: "#c62828"
                            }}
                        >
                            !
                        </span>

                        <span>
                            Critical Pollution
                        </span>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div style={styles.summaryContainer}>
                <div style={styles.summary}>
                    <div style={styles.summaryNumber}>
                        {waterBodies.length}
                    </div>

                    <div>
                        <div style={styles.summaryTitle}>
                            Monitored Water Bodies
                        </div>

                        <div style={styles.summaryText}>
                            Freshwater locations currently
                            tracked by the community platform.
                        </div>
                    </div>
                </div>

                <div style={styles.summary}>
                    <div style={styles.summaryNumber}>
                        {pollutionReports.length}
                    </div>

                    <div>
                        <div style={styles.summaryTitle}>
                            Pollution Reports
                        </div>

                        <div style={styles.summaryText}>
                            Community reports recorded across
                            monitored water bodies.
                        </div>
                    </div>
                </div>
            </div>

            {/* Water body list */}
            <div style={styles.listCard}>
                <h2 style={styles.listTitle}>
                    Monitored Water Bodies
                </h2>

                {waterBodies.length === 0 ? (
                    <div style={styles.empty}>
                        No water bodies have been added yet.
                    </div>
                ) : (
                    waterBodies.map((waterBody) => (
                        <div
                            key={waterBody._id}
                            style={styles.waterBodyRow}
                        >
                            <div style={styles.waterInfo}>
                                <h3 style={styles.waterName}>
                                    🌊 {waterBody.name}
                                </h3>

                                <div style={styles.location}>
                                    📍{" "}
                                    {waterBody.location.address}
                                </div>

                                <div style={styles.type}>
                                    Type:{" "}
                                    <strong>
                                        {waterBody.type}
                                    </strong>
                                </div>
                            </div>

                            <div style={styles.actions}>
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

                                <button
                                    onClick={() =>
                                        onViewDetails(waterBody)
                                    }
                                    style={styles.button}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    headingSection: {
        marginBottom: "25px"
    },

    title: {
        margin: "0 0 8px 0",
        color: "#155e75",
        fontSize: "34px"
    },

    subtitle: {
        margin: 0,
        color: "#546e7a",
        fontSize: "16px",
        lineHeight: "1.6"
    },

    mapCard: {
        backgroundColor: "#ffffff",
        padding: "12px",
        borderRadius: "14px",
        boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.08)",
        overflow: "hidden"
    },

    map: {
        width: "100%",
        height: "500px",
        borderRadius: "10px"
    },

    popup: {
        minWidth: "220px",
        fontFamily: "Arial, sans-serif"
    },

    popupTitle: {
        marginTop: 0,
        marginBottom: "10px",
        color: "#155e75"
    },

    pollutionTitle: {
        marginTop: 0,
        marginBottom: "10px",
        color: "#c62828"
    },

    popupLocation: {
        color: "#607d8b",
        lineHeight: "1.5"
    },

    description: {
        lineHeight: "1.5",
        color: "#455a64"
    },

    healthBadge: {
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700"
    },

    button: {
        backgroundColor: "#087f5b",
        color: "#ffffff",
        border: "none",
        padding: "9px 15px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer"
    },

    legendCard: {
        backgroundColor: "#ffffff",
        marginTop: "20px",
        padding: "20px 25px",
        borderRadius: "14px",
        boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.06)"
    },

    legendTitle: {
        margin: "0 0 15px 0",
        color: "#155e75",
        fontSize: "18px"
    },

    legendItems: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px"
    },

    legendItem: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#455a64",
        fontSize: "14px"
    },

    waterLegendMarker: {
        fontSize: "20px"
    },

    pollutionLegendMarker: {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        color: "#ffffff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        fontWeight: "700"
    },

    summaryContainer: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
        marginTop: "25px"
    },

    summary: {
        backgroundColor: "#e0f2f1",
        padding: "20px 25px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "18px"
    },

    summaryNumber: {
        fontSize: "32px",
        fontWeight: "700",
        color: "#087f5b"
    },

    summaryTitle: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#155e75"
    },

    summaryText: {
        marginTop: "4px",
        color: "#546e7a",
        fontSize: "14px"
    },

    listCard: {
        backgroundColor: "#ffffff",
        marginTop: "25px",
        padding: "25px",
        borderRadius: "14px",
        boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.06)"
    },

    listTitle: {
        margin: "0 0 20px 0",
        color: "#155e75",
        fontSize: "23px"
    },

    waterBodyRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        padding: "18px 0",
        borderBottom: "1px solid #e0e0e0"
    },

    waterInfo: {
        flex: 1
    },

    waterName: {
        margin: "0 0 7px 0",
        color: "#263238",
        fontSize: "18px"
    },

    location: {
        color: "#607d8b",
        fontSize: "14px",
        marginBottom: "7px"
    },

    type: {
        color: "#78909c",
        fontSize: "13px"
    },

    actions: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },

    empty: {
        textAlign: "center",
        padding: "30px",
        color: "#607d8b"
    },

    message: {
        textAlign: "center",
        padding: "60px",
        fontSize: "18px",
        color: "#546e7a"
    },

    error: {
        backgroundColor: "#ffebee",
        color: "#c62828",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center"
    }
};

export default WaterBodyMap;