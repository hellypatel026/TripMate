const express = require("express");

const {
    addMedia,
    getGallery,
    deleteMedia
} = require("../controllers/galleryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/:tripId",
    protect,
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