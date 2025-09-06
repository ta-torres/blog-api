import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/multer.js";

const uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    res.status(200).json({
      sucess: true,
      message: "Image uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ sucess: false, message: "Image upload failed" });
  }
};

const cloudinaryUpload = upload.single("image");

const uploadController = {
  cloudinaryUpload,
  uploadImage,
};

export default uploadController;
