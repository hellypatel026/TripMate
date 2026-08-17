const express = require("express");

const {
    addMedia,
    getGallery,
    deleteMedia
} = require("../controllers/galleryController");

//const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/:tripId",
    
    addMedia
);

router.get(
    "/:tripId",
  
    getGallery
);

router.delete(
    "/:id",
   
    deleteMedia
);

module.exports = router;