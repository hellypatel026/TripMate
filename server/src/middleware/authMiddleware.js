const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded.userId;

        next();

    } catch (error) {

        console.error("Authentication Error:", error);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = protect;