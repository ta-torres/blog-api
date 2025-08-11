import express from "express";
import authController from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateSignup, validateLogin } from "../middleware/validation.js";

const router = express.Router();

router.post("/signup", validateSignup, authController.signup);
router.post("/login", validateLogin, authController.login);
router.get("/profile", authenticateToken, authController.getProfile);

export default router;
