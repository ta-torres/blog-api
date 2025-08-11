import express from "express";
import {
  getPostComments,
  createComment,
  deleteComment,
} from "../controllers/commentController.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";
import { validateCreateComment } from "../middleware/validation.js";

const router = express.Router();

router.get("/post/:postId", optionalAuth, getPostComments);

router.post("/", validateCreateComment, authenticateToken, createComment);
router.delete("/:id", authenticateToken, deleteComment);

export default router;
