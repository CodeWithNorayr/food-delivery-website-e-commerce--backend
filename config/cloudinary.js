import { v2 as cloudinary } from "cloudinary";

const cloudinaryConnect = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET, // ✅ FIXED
    });

    console.log("Cloudinary configured");
  } catch (error) {
    console.error("Cloudinary config error:", error);
    throw error;
  }
};

export default cloudinaryConnect;
