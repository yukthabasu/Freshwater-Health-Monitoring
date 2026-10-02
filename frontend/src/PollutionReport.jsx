import { useEffect, useState } from "react";
import axios from "axios";

function PollutionReport() {
    const [waterBodies, setWaterBodies] = useState([]);

    const [waterBody, setWaterBody] = useState("");
    const [pollutionType, setPollutionType] = useState("");
    const [severity, setSeverity] = useState("Medium");
    const [description, setDescription] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [evidenceImage, setEvidenceImage] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Load water bodies
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/water-bodies")
            .then((response) => {
                setWaterBodies(
                    response.data.waterBodies || []
                );
            })
            .catch((error) => {
                console.error(error);
                setError(
                    "Unable to load water bodies."
                );
            });
    }, []);

    // Get current location
    const getLocation = () => {
        if (!navigator.geolocation) {
            setError(
                "Geolocation is not supported by your browser."
            );
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(
                    position.coords.latitude.toFixed(6)
                );

                setLongitude(
                    position.coords.longitude.toFixed(6)
                );

                setError("");
            },
            () => {
                setError(
                    "Unable to get your location. You can enter it manually."
                );
            }
        );
    };

    // Handle evidence image selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];

        setError("");
        setMessage("");

        if (!file) {
            setEvidenceImage(null);
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            setError(
                "Please select a JPG, JPEG, PNG or WEBP image."
            );

            event.target.value = "";
            setEvidenceImage(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Image size must be 5 MB or smaller."
            );

            event.target.value = "";
            setEvidenceImage(null);
            return;
        }

        setEvidenceImage(file);
    };

    // Submit pollution report
    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        // Validate frontend fields
        if (!waterBody) {
            setError(
                "Please select a water body."
            );
            return;
        }

        if (!pollutionType) {
            setError(
                "Please select a pollution type."
            );
            return;
        }

        if (!description.trim()) {
            setError(
                "Please enter a description."
            );
            return;
        }

        setSubmitting(true);

        try {
            // Temporary test user login
            const loginResponse = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email: "yuktha.test@gmail.com",
                    password: "Test@12345"
                }
            );

            console.log(
                "LOGIN RESPONSE:",
                loginResponse.data
            );

            const user = loginResponse.data.user;

            const userId =
                user?._id ||
                user?.id;

            console.log(
                "USER OBJECT:",
                user
            );

            console.log(
                "USER ID:",
                userId
            );

            if (!userId) {
                setError(
                    "User ID was not returned by the login API."
                );

                setSubmitting(false);
                return;
            }

            // Create FormData for text + image
            const formData = new FormData();

            formData.append(
                "waterBody",
                waterBody
            );

            formData.append(
                "reportedBy",
                userId
            );

            formData.append(
                "pollutionType",
                pollutionType
            );

            formData.append(
                "description",
                description.trim()
            );

            formData.append(
                "severity",
                severity
            );

            if (latitude !== "") {
                formData.append(
                    "latitude",
                    latitude
                );
            }

            if (longitude !== "") {
                formData.append(
                    "longitude",
                    longitude
                );
            }

            if (evidenceImage) {
                formData.append(
                    "evidenceImage",
                    evidenceImage
                );
            }

            console.log(
                "SUBMITTING POLLUTION REPORT"
            );

            // Submit report
            const response = await axios.post(
                "http://localhost:5000/api/pollution-reports",
                formData
            );

            console.log(
                "REPORT RESPONSE:",
                response.data
            );

            setMessage(
                "Pollution report submitted successfully!"
            );

            // Reset form
            setWaterBody("");
            setPollutionType("");
            setSeverity("Medium");
            setDescription("");
            setLatitude("");
            setLongitude("");
            setEvidenceImage(null);

            // Clear file input
            const fileInput =
                document.getElementById(
                    "evidenceImage"
                );

            if (fileInput) {
                fileInput.value = "";
            }
        } catch (error) {
            console.error(
                "POLLUTION REPORT ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to submit pollution report."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div style={styles.headingSection}>
                <h1 style={styles.title}>
                    Report Water Pollution
                </h1>

                <p style={styles.subtitle}>
                    Help the community identify and monitor
                    pollution in freshwater bodies.
                </p>
            </div>

            <div style={styles.card}>
                <form onSubmit={handleSubmit}>

                    {/* WATER BODY */}
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Water Body
                        </label>

                        <select
                            value={waterBody}
                            onChange={(event) => {
                                setWaterBody(
                                    event.target.value
                                );
                                setError("");
                            }}
                            style={styles.select}
                        >
                            <option value="">
                                Select a water body
                            </option>

                            {waterBodies.map((item) => (
                                <option
                                    key={item._id}
                                    value={item._id}
                                >
                                    {item.name} ({item.type})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* POLLUTION TYPE */}
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Pollution Type
                        </label>

                        <select
                            value={pollutionType}
                            onChange={(event) => {
                                setPollutionType(
                                    event.target.value
                                );
                                setError("");
                            }}
                            style={styles.select}
                        >
                            <option value="">
                                Select pollution type
                            </option>

                            <option value="Plastic Waste">
                                Plastic Waste
                            </option>

                            <option value="Sewage">
                                Sewage
                            </option>

                            <option value="Chemical Waste">
                                Chemical Waste
                            </option>

                            <option value="Oil Spill">
                                Oil Spill
                            </option>

                            <option value="Garbage Dumping">
                                Garbage Dumping
                            </option>

                            <option value="Dead Fish">
                                Dead Fish
                            </option>

                            <option value="Other">
                                Other
                            </option>
                        </select>
                    </div>

                    {/* SEVERITY */}
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Severity
                        </label>

                        <select
                            value={severity}
                            onChange={(event) => {
                                setSeverity(
                                    event.target.value
                                );
                                setError("");
                            }}
                            style={styles.select}
                        >
                            <option value="Low">
                                Low
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="High">
                                High
                            </option>

                            <option value="Critical">
                                Critical
                            </option>
                        </select>
                    </div>

                    {/* DESCRIPTION */}
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) => {
                                setDescription(
                                    event.target.value
                                );
                                setError("");
                            }}
                            placeholder="Describe what you observed..."
                            rows="5"
                            style={styles.textarea}
                        />
                    </div>

                    {/* EVIDENCE IMAGE */}
                    <div style={styles.evidenceSection}>
                        <h3 style={styles.evidenceTitle}>
                            📷 Evidence Photo
                        </h3>

                        <p style={styles.evidenceText}>
                            Upload a photo showing the pollution
                            you observed. This helps the community
                            verify the report.
                        </p>

                        <input
                            id="evidenceImage"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageChange}
                            style={styles.fileInput}
                        />

                        {evidenceImage && (
                            <div style={styles.fileSelected}>
                                ✅ Selected:{" "}
                                {evidenceImage.name}
                            </div>
                        )}

                        <p style={styles.fileHint}>
                            Supported: JPG, JPEG, PNG, WEBP
                            <br />
                            Maximum size: 5 MB
                        </p>
                    </div>

                    {/* LOCATION */}
                    <div style={styles.locationSection}>
                        <h3 style={styles.locationTitle}>
                            Observation Location
                        </h3>

                        <p style={styles.locationText}>
                            Add your location so the community can
                            understand where the pollution was observed.
                        </p>

                        <button
                            type="button"
                            onClick={getLocation}
                            style={styles.locationButton}
                        >
                            📍 Use My Current Location
                        </button>

                        <div style={styles.locationGrid}>
                            <input
                                type="text"
                                value={latitude}
                                onChange={(event) =>
                                    setLatitude(
                                        event.target.value
                                    )
                                }
                                placeholder="Latitude"
                                style={styles.input}
                            />

                            <input
                                type="text"
                                value={longitude}
                                onChange={(event) =>
                                    setLongitude(
                                        event.target.value
                                    )
                                }
                                placeholder="Longitude"
                                style={styles.input}
                            />
                        </div>
                    </div>

                    {/* SUCCESS */}
                    {message && (
                        <div style={styles.success}>
                            ✅ {message}
                        </div>
                    )}

                    {/* ERROR */}
                    {error && (
                        <div style={styles.error}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            ...styles.submitButton,
                            opacity: submitting
                                ? 0.7
                                : 1
                        }}
                    >
                        {submitting
                            ? "Submitting..."
                            : "Submit Pollution Report"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    headingSection: {
        textAlign: "center",
        marginBottom: "30px"
    },

    title: {
        margin: "0 0 10px 0",
        color: "#155e75",
        fontSize: "34px"
    },

    subtitle: {
        margin: 0,
        color: "#546e7a",
        fontSize: "17px",
        lineHeight: "1.6"
    },

    card: {
        maxWidth: "750px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        padding: "35px",
        borderRadius: "16px",
        boxShadow:
            "0 5px 20px rgba(0, 0, 0, 0.08)"
    },

    field: {
        marginBottom: "22px"
    },

    label: {
        display: "block",
        marginBottom: "8px",
        color: "#263238",
        fontWeight: "600",
        fontSize: "15px"
    },

    select: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 14px",
        border: "1px solid #b0bec5",
        borderRadius: "8px",
        fontSize: "15px",
        color: "#263238",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        outline: "none"
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 14px",
        border: "1px solid #cfd8dc",
        borderRadius: "8px",
        fontSize: "15px",
        color: "#263238",
        backgroundColor: "#ffffff",
        outline: "none"
    },

    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 14px",
        border: "1px solid #cfd8dc",
        borderRadius: "8px",
        fontSize: "15px",
        color: "#263238",
        backgroundColor: "#ffffff",
        resize: "vertical",
        fontFamily: "Arial, sans-serif",
        outline: "none"
    },

    evidenceSection: {
        backgroundColor: "#f0f9ff",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "22px",
        border: "1px solid #cfe8f3"
    },

    evidenceTitle: {
        margin: "0 0 8px 0",
        color: "#155e75"
    },

    evidenceText: {
        color: "#607d8b",
        fontSize: "14px",
        lineHeight: "1.5",
        marginTop: 0
    },

    fileInput: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        backgroundColor: "#ffffff",
        border: "1px solid #b0bec5",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px"
    },

    fileSelected: {
        marginTop: "12px",
        padding: "10px",
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        borderRadius: "7px",
        fontSize: "14px"
    },

    fileHint: {
        color: "#78909c",
        fontSize: "12px",
        lineHeight: "1.5",
        marginBottom: 0
    },

    locationSection: {
        backgroundColor: "#f1f8f6",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "22px"
    },

    locationTitle: {
        margin: "0 0 8px 0",
        color: "#155e75"
    },

    locationText: {
        color: "#607d8b",
        fontSize: "14px",
        lineHeight: "1.5"
    },

    locationButton: {
        backgroundColor: "#1976d2",
        color: "#ffffff",
        border: "none",
        padding: "10px 16px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600",
        marginBottom: "15px"
    },

    locationGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px"
    },

    success: {
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        padding: "14px",
        borderRadius: "8px",
        marginBottom: "18px"
    },

    error: {
        backgroundColor: "#ffebee",
        color: "#c62828",
        padding: "14px",
        borderRadius: "8px",
        marginBottom: "18px"
    },

    submitButton: {
        width: "100%",
        backgroundColor: "#087f5b",
        color: "#ffffff",
        border: "none",
        padding: "14px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "700",
        cursor: "pointer"
    }
};

export default PollutionReport;