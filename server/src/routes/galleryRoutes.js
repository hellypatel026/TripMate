const express = require("express");

const {
    addMedia,
    getGallery,
    deleteMedia
} = require("../controllers/galleryController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.post(
    "/:tripId",
    protect,
    upload.single("file"),
    addMedia
);

router.get(
    "/:tripId",
    protect,
    getGallery
);

router.delete(
    "/:id",
   protect,
    deleteMedia
);

module.exports = router;