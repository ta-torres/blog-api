import express from "express";
import {
  getPublishedPosts,
  getAllPosts,
  getPost,
  createPost,
  deletePost,
} from "../controllers/postController.js";
import {
  authenticateToken,
  requireAuthor,
  optionalAuth,
} from "../middleware/auth.js";

const router = express.Router();

// author before getPublishedPosts
router.get("/all", authenticateToken, requireAuthor, getAllPosts);
router.get("/", getPublishedPosts);
router.get("/:id", optionalAuth, getPost);

router.post("/", authenticateToken, requireAuthor, createPost);
router.delete("/:id", authenticateToken, requireAuthor, deletePost);

export default router;
