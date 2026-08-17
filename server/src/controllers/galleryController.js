const Gallery = require("../models/Gallery");


// ADD MEDIA

const addMedia = async (req, res) => {
    try {
        const {
            mediaUrl,
            mediaType,
            caption
        } = req.body;

        if (!mediaUrl || !mediaType) {
            return res.status(400).json({
                message: "Media URL and media type are required"
            });
        }

        const media = await Gallery.create({
            trip: req.params.tripId,
            uploadedBy: req.user,
            mediaUrl,
            mediaType,
            caption
        });

        res.status(201).json({
            message: "Media uploaded successfully",
            media
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to upload media"
        });
    }
};


// GET GALLERY

const getGallery = async (req, res) => {
    try {
        const gallery = await Gallery.find({
            trip: req.params.tripId
        })
        .populate(
            "uploadedBy",
            "name profilePicture"
        )
        .sort({ createdAt: -1 });

        res.status(200).json({
            gallery
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch gallery"
        });
    }
};


// DELETE MEDIA

const deleteMedia = async (req, res) => {
    try {
        const media = await Gallery.findOne({
            _id: req.params.id,
            uploadedBy: req.user
        });

        if (!media) {
            return res.status(404).json({
                message: "Media not found"
            });
        }

        await Gallery.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Media deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete media"
        });
    }
};


module.exports = {
    addMedia,
    getGallery,
    deleteMedia
};