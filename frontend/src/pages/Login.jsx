import { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";

function Login({
    onLoginSuccess,
    onGoToRegister
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!email || !password) {
            setError(
                "Please enter your email and password."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password
                }
            );

            const user = response.data.user;
            const token = response.data.token;

            login(user, token);

            if (onLoginSuccess) {
                onLoginSuccess();
            }
        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Login failed. Please check your email and password."
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
                    Welcome Back
                </h2>

                <p style={styles.description}>
                    Sign in to monitor freshwater
                    bodies and submit community
                    pollution reports.
                </p>

                {error && (
                    <div style={styles.error}>
                        ⚠️ {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    style={styles.form}
                >
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
                        placeholder="Enter your password"
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
                            ? "Signing in..."
                            : "Sign In"}
                    </button>
                </form>

                <div style={styles.registerSection}>
                    <span>
                        Don't have an account?
                    </span>

                    <button
                        type="button"
                        onClick={
                            onGoToRegister
                        }
                        style={
                            styles.registerButton
                        }
                    >
                        Create Account
                    </button>
                </div>

                <div style={styles.info}>
                    <strong>
                        Test account
                    </strong>

                    <div>
                        Email: yuktha.test@gmail.com
                    </div>

                    <div>
                        Password: Test@12345
                    </div>
                </div>
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
        maxWidth: "430px",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "35px",
        boxShadow:
            "0 8px 30px rgba(0, 0, 0, 0.10)"
    },

    icon: {
        textAlign: "center",
        fontSize: "45px",
        marginBottom: "10px"
    },

    title: {
        textAlign: "center",
        margin: 0,
        color: "#155e75",
        fontSize: "25px"
    },

    subtitle: {
        textAlign: "center",
        margin: "5px 0 25px 0",
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
        marginBottom: "16px",
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

    registerSection: {
        textAlign: "center",
        marginTop: "22px",
        color: "#78909c",
        fontSize: "13px"
    },

    registerButton: {
        display: "block",
        margin: "7px auto 0 auto",
        backgroundColor: "transparent",
        color: "#087f5b",
        border: "none",
        fontSize: "13px",
        fontWeight: "700",
        cursor: "pointer"
    },

    info: {
        marginTop: "22px",
        padding: "14px",
        backgroundColor: "#f1f8f7",
        borderRadius: "8px",
        color: "#546e7a",
        fontSize: "12px",
        lineHeight: "1.7"
    }
};

export default Login;