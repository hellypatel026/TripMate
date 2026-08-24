// const Gallery = require("../models/Gallery");
// const TripMember = require("../models/TripMember");

// // ADD MEDIA

// const addMedia = async (req, res) => {
//     try {
//         const {
//             mediaUrl,
//             mediaType,
//             caption
//         } = req.body;

//         if (!mediaUrl || !mediaType) {
//             return res.status(400).json({
//                 message: "Media URL and media type are required"
//             });
//         }

//         const media = await Gallery.create({
//             trip: req.params.tripId,
//             uploadedBy: req.user,
//             mediaUrl,
//             mediaType,
//             caption
//         });

//         res.status(201).json({
//             message: "Media uploaded successfully",
//             media
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Failed to upload media"
//         });
//     }
// };


// // GET GALLERY

// const getGallery = async (req, res) => {
//     try {
//         const gallery = await Gallery.find({
//             trip: req.params.tripId
//         })
//         .populate(
//             "uploadedBy",
//             "name profilePicture"
//         )
//         .sort({ createdAt: -1 });

//         res.status(200).json({
//             gallery
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Failed to fetch gallery"
//         });
//     }
// };


// // DELETE MEDIA

// const deleteMedia = async (req, res) => {
//     try {
//         const media = await Gallery.findOne({
//             _id: req.params.id,
//             uploadedBy: req.user
//         });

//         if (!media) {
//             return res.status(404).json({
//                 message: "Media not found"
//             });
//         }

//         await Gallery.findByIdAndDelete(req.params.id);

//         res.status(200).json({
//             message: "Media deleted successfully"
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Failed to delete media"
//         });
//     }
// };


// module.exports = {
//     addMedia,
//     getGallery,
//     deleteMedia
// };

const Gallery = require("../models/Gallery");
const TripMember = require("../models/TripMember");


// ==========================================
// ADD MEDIA
// ==========================================

const addMedia = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { caption } = req.body;

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload an image or video"
            });
        }

        // Check if user is a member of the trip
        const member = await TripMember.findOne({
            trip: tripId,
            user: req.user
        });

        if (!member) {
            return res.status(403).json({
                message: "You are not a member of this trip"
            });
        }
         

        // Determine media type
        const extension = req.file.originalname.split(".").pop().toLowerCase();

        let mediaType;

        if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
            mediaType = "image";
        } else if (["mp4", "mov", "avi", "mkv", "webm"].includes(extension)) {
    mediaType = "video";
} else {
    return res.status(400).json({
                message: "Only images and videos are allowed"
            });
        }

        // Create gallery record
        const media = await Gallery.create({
            trip: tripId,
            uploadedBy: req.user,
            mediaUrl: req.file.path,
            mediaType,
            caption: caption || ""
        });

        res.status(201).json({
            message: "Media uploaded successfully",
            media
        });

    } catch (error) {
        console.error("Add Media Error:", error);

        res.status(500).json({
            message: "Failed to upload media",
            error: error.message
        });
    }
};


// ==========================================
// GET GALLERY
// ==========================================

const getGallery = async (req, res) => {
    try {
        const { tripId } = req.params;

        // Check if user is a trip member
        const member = await TripMember.findOne({
            trip: tripId,
            user: req.user
        });

        if (!member) {
            return res.status(403).json({
                message: "You are not a member of this trip"
            });
        }

        const gallery = await Gallery.find({
            trip: tripId
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
        console.error("Get Gallery Error:", error);

        res.status(500).json({
            message: "Failed to fetch gallery",
            error: error.message
        });
    }
};


// ==========================================
// DELETE MEDIA
// ==========================================

const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;

        const media = await Gallery.findById(id);

        if (!media) {
            return res.status(404).json({
                message: "Media not found"
            });
        }

        // Only uploader can delete
        if (media.uploadedBy.toString() !== req.user.toString()) {
            return res.status(403).json({
                message: "Only the uploader can delete this media"
            });
        }

        await Gallery.findByIdAndDelete(id);

        res.status(200).json({
            message: "Media deleted successfully"
        });

    } catch (error) {
        console.error("Delete Media Error:", error);

        res.status(500).json({
            message: "Failed to delete media",
            error: error.message
        });
    }
};


module.exports = {
    addMedia,
    getGallery,
    deleteMedia
};