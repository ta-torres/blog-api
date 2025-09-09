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
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
};

const cloudinaryUpload = upload.single("image");

const deleteContent = async (req, res) => {
  const { public_id } = req.body;

  try {
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      return res.status(200).json({
        success: true,
        message: "Image deleted successfully",
        data: result,
      });
    }

    res.status(404).json({ success: false, message: result.result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
};

const uploadController = {
  cloudinaryUpload,
  uploadImage,
  deleteContent,
};

export default uploadController;
