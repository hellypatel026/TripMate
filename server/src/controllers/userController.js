const User = require("../models/User");

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.create({
            name,
            email,
            password
        });

        res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create user",
            error: error.message
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        .select("-password")
            .sort({ createdAt: -1 });

            res.status(200).json({
            message: "Users fetched successfully",
            users
        });
    } catch (error) {
        console.error("Get Users Error:",error);
        res.status(500).json({
            message: "Failed to fetch users"
        });
    }
}

// ==========================================
// GET USER BY ID
// ==========================================

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User fetched successfully",
            user
        });

    } catch (error) {
        console.error("Get User Error:", error);

        res.status(500).json({
            message: "Failed to fetch user"
        });
    }
};
// ==========================================
// UPDATE USER
// ==========================================

const updateUser = async (req, res) => {
    try {
        const { name, email, profilePicture } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Update only fields that are provided
        if (name !== undefined) {
            user.name = name;
        }

        if (email !== undefined) {
            user.email = email;
        }

        if (profilePicture !== undefined) {
            user.profilePicture = profilePicture;
        }

        await user.save();

        const updatedUser = user.toObject();

        delete updatedUser.password;

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update User Error:", error);

        res.status(500).json({
            message: "Failed to update user"
        });
    }
};
// ==========================================
// DELETE USER
// ==========================================

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete User Error:", error);

        res.status(500).json({
            message: "Failed to delete user"
        });
    }
};



module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};