import { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";

function Register({ onRegisterSuccess }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !name ||
            !email ||
            !location ||
            !password ||
            !confirmPassword
        ) {
            setError(
                "Please fill in all the fields."
            );
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    name,
                    email,
                    password,
                    location
                }
            );

            const user = response.data.user;
            const token = response.data.token;

            setSuccess(
                "Account created successfully!"
            );

            login(user, token);

            setTimeout(() => {
                if (onRegisterSuccess) {
                    onRegisterSuccess();
                }
            }, 500);
        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.icon}>
                    💧
                </div>

                <h1 style={styles.title}>
                    Freshwater Monitoring
                </h1>

                <p style={styles.subtitle}>
                    Community Platform
                </p>

                <h2 style={styles.heading}>
                    Create Account
                </h2>

                <p style={styles.description}>
                    Join the community and help
                    monitor freshwater health.
                </p>

                {error && (
                    <div style={styles.error}>
                        ⚠️ {error}
                    </div>
                )}

                {success && (
                    <div style={styles.success}>
                        ✅ {success}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    style={styles.form}
                >
                    <label style={styles.label}>
                        Full Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(
                                event.target.value
                            )
                        }
                        placeholder="Enter your name"
                        style={styles.input}
                    />

                    <label style={styles.label}>
                        Email Address
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                        placeholder="Enter your email"
                        style={styles.input}
                    />

                    <label style={styles.label}>
                        Location
                    </label>

                    <input
                        type="text"
                        value={location}
                        onChange={(event) =>
                            setLocation(
                                event.target.value
                            )
                        }
                        placeholder="Example: Bengaluru"
                        style={styles.input}
                    />

                    <label style={styles.label}>
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }
                        placeholder="Create a password"
                        style={styles.input}
                    />

                    <label style={styles.label}>
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(
                                event.target.value
                            )
                        }
                        placeholder="Re-enter your password"
                        style={styles.input}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.button,
                            opacity: loading
                                ? 0.7
                                : 1
                        }}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>
                </form>

                <div style={styles.footerText}>
                    Already have an account?
                </div>

                <button
                    type="button"
                    onClick={() => {
                        if (
                            onRegisterSuccess
                        ) {
                            onRegisterSuccess(
                                "login"
                            );
                        }
                    }}
                    style={styles.loginButton}
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background:
            "linear-gradient(135deg, #e0f2f1, #e3f2fd)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily:
            "Arial, Helvetica, sans-serif"
    },

    card: {
        width: "100%",
        maxWidth: "460px",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "35px",
        boxShadow:
            "0 8px 30px rgba(0, 0, 0, 0.10)"
    },

    icon: {
        textAlign: "center",
        fontSize: "42px",
        marginBottom: "8px"
    },

    title: {
        textAlign: "center",
        margin: 0,
        color: "#155e75",
        fontSize: "24px"
    },

    subtitle: {
        textAlign: "center",
        margin: "5px 0 22px 0",
        color: "#78909c",
        fontSize: "13px"
    },

    heading: {
        margin: "0 0 8px 0",
        color: "#263238",
        fontSize: "22px"
    },

    description: {
        margin: "0 0 20px 0",
        color: "#607d8b",
        fontSize: "14px",
        lineHeight: "1.5"
    },

    error: {
        backgroundColor: "#ffebee",
        color: "#c62828",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "18px",
        fontSize: "13px"
    },

    success: {
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "18px",
        fontSize: "13px"
    },

    form: {
        display: "flex",
        flexDirection: "column"
    },

    label: {
        color: "#37474f",
        fontSize: "13px",
        fontWeight: "700",
        marginBottom: "6px"
    },

    input: {
        padding: "12px",
        border:
            "1px solid #cfd8dc",
        borderRadius: "7px",
        fontSize: "14px",
        marginBottom: "15px",
        outline: "none",
        boxSizing: "border-box",
        width: "100%"
    },

    button: {
        backgroundColor: "#087f5b",
        color: "#ffffff",
        border: "none",
        padding: "13px",
        borderRadius: "7px",
        fontSize: "15px",
        fontWeight: "700",
        cursor: "pointer",
        marginTop: "5px"
    },

    footerText: {
        textAlign: "center",
        marginTop: "22px",
        color: "#78909c",
        fontSize: "13px"
    },

    loginButton: {
        display: "block",
        margin: "8px auto 0 auto",
        backgroundColor: "transparent",
        color: "#087f5b",
        border: "none",
        fontSize: "13px",
        fontWeight: "700",
        cursor: "pointer"
    }
};

export default Register;