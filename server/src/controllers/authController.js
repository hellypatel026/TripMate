const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ==========================================
// GENERATE JWT
// ==========================================

const generateToken = (userId) => {
    return jwt.sign(
        {
            userId: userId.toString()
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
};


// ==========================================
// REGISTER
// ==========================================

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with this email"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        // Generate token
        const token = generateToken(user._id);

        // Store token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "Registration successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        console.error("Register Error:", error);

        res.status(500).json({
            message: "Failed to register user",
            error: error.message
        });
    }
};


// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user including password
        const user = await User.findOne({
            email: email.toLowerCase()
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = generateToken(user._id);

        // Store token
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            message: "Failed to login",
            error: error.message
        });
    }
};


// ==========================================
// LOGOUT
// ==========================================

const logout = async (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        console.error("Logout Error:", error);

        res.status(500).json({
            message: "Failed to logout"
        });
    }
};


// ==========================================
// GET CURRENT USER
// ==========================================

const getMe = async (req, res) => {
    try {

        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        console.error("Get Me Error:", error);

        res.status(500).json({
            message: "Failed to get current user"
        });
    }
};


module.exports = {
    register,
    login,
    logout,
    getMe
};