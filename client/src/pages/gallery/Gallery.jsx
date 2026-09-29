import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const Gallery = () => {
    const { tripId } = useParams();

    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
const [uploading, setUploading] = useState(false);
    const loadGallery = async () => {
        try {
            const response = await api.get(`/gallery/${tripId}`);

            console.log("Gallery response:", response.data);

            setMedia(response.data.gallery);
        } catch (error) {
            console.error("Error loading gallery:", error);

            alert(
                error.response?.data?.message ||
                "Failed to load gallery"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGallery();
    }, [tripId]);

    if (loading) {
        return <p>Loading gallery...</p>;
    }

    return (
        <div>
            <h1>Trip Gallery</h1>
            <input
    type="file"
    accept="image/*"
    onChange={(e) => {
        setSelectedFile(e.target.files[0]);
    }}
/>

<button
    onClick={async () => {
        if (!selectedFile) {
            alert("Please select an image first.");
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await api.post(
                `/gallery/${tripId}`,
                formData
            );

            console.log("Upload response:", response.data);

            alert("Image uploaded successfully!");

            setSelectedFile(null);

            // Refresh gallery
            loadGallery();
        } catch (error) {
            console.error("Error uploading image:", error);

            alert(
                error.response?.data?.message ||
                "Failed to upload image"
            );
        } finally {
            setUploading(false);
        }
    }}
    disabled={uploading}
>
    {uploading ? "Uploading..." : "Upload Image"}
</button>

            {media.length === 0 ? (
    <p>No images in this trip gallery yet.</p>
) : (
    <div>
        {media.map((item) => (
            <div key={item._id}>
                <img
                    src={item.mediaUrl}
                    alt={item.fileName || "Trip image"}
                    style={{
                        width: "250px",
                        height: "200px",
                        objectFit: "cover",
                        margin: "10px",
                        borderRadius: "10px",
                    }}
                />
            </div>
        ))}
    </div>
)}
        </div>
    );
};

export default Gallery;