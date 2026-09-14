const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "tripmate/gallery",
        resource_type: "auto",
        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "mp4",
            "mov",
            "avi"
        ]
    }
});

const upload = multer({
    storage
});

module.exports = upload;