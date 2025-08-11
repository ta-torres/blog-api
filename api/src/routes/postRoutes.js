import express from "express";
import postController from "../controllers/postController.js";
import {
  authenticateToken,
  requireAuthor,
  optionalAuth,
} from "../middleware/auth.js";
import { validateCreatePost } from "../middleware/validation.js";

const router = express.Router();

// author before getPublishedPosts
router.get(
  "/all",
  authenticateToken,
  requireAuthor,
  postController.getAllPosts,
);
router.get("/", postController.getPublishedPosts);
router.get("/:id", optionalAuth, postController.getPost);

router.post(
  "/",
  validateCreatePost,
  authenticateToken,
  requireAuthor,
  postController.createPost,
);
router.delete(
  "/:id",
  authenticateToken,
  requireAuthor,
  postController.deletePost,
);

export default router;
