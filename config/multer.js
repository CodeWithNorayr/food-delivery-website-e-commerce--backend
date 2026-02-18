import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

/* ===============================
   ✅ Cloudinary Config
================================= */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

/* ===============================
   ✅ Cloudinary Storage
================================= */
const storage = new CloudinaryStorage({
  cloudinary,

  params: (req, file) => {
    let folder = "general";

    // ✅ Store food images separately
    if (req.baseUrl.includes("foods")) {
      folder = "foods/images";
    }

    // ✅ Allow only images
    if (!file.mimetype.startsWith("image/")) {
      throw new Error("Only image files are allowed!");
    }

    return {
      folder: folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: `${Date.now()}-${path.parse(file.originalname).name}`,
    };
  },
});

/* ===============================
   ✅ Multer Upload Middleware
================================= */
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // ✅ 5MB recommended for images
  },
});

export default upload;
