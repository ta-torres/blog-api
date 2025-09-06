import express from "express";
import uploadController from "../controllers/uploadController.js";
import { authenticateToken, requireAuthor } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  requireAuthor,
  uploadController.cloudinaryUpload,
  uploadController.uploadImage,
);

export default router;
