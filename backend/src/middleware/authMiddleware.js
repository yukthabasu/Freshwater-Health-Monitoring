const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message:
                    "Authentication required. Please log in."
            });
        }

        const token =
            authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Our JWT stores the user ID as "id"
        const user =
            await User.findById(
                decoded.id
            ).select("-password");

        if (!user) {
            return res.status(401).json({
                message:
                    "User account not found."
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error(
            "Authentication error:",
            error.message
        );

        return res.status(401).json({
            message:
                "Invalid or expired authentication token."
        });
    }
};

const adminOnly = (
    req,
    res,
    next
) => {
    if (
        !req.user ||
        req.user.role !== "admin"
    ) {
        return res.status(403).json({
            message:
                "Admin access required."
        });
    }

    next();
};

module.exports = {
    protect,
    adminOnly
};