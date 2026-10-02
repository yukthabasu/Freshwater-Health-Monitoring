import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser =
            localStorage.getItem("freshwaterUser");

        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error(
                    "Failed to load saved user:",
                    error
                );

                localStorage.removeItem(
                    "freshwaterUser"
                );
            }
        }

        setLoading(false);
    }, []);

    const login = (userData, token) => {
        setUser(userData);

        localStorage.setItem(
            "freshwaterUser",
            JSON.stringify(userData)
        );

        if (token) {
            localStorage.setItem(
                "freshwaterToken",
                token
            );
        }
    };

    const logout = () => {
        setUser(null);

        localStorage.removeItem(
            "freshwaterUser"
        );

        localStorage.removeItem(
            "freshwaterToken"
        );
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}