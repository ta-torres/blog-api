import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import passport from "passport";

const prisma = new PrismaClient();
// create jwt token on signup login, author as false
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isAuthor: false,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isAuthor: user.isAuthor,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        isAuthor: user.isAuthor,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!user) {
      return res.status(400).json({
        error: info.message || "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isAuthor: user.isAuthor,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        isAuthor: user.isAuthor,
      },
    });
  })(req, res, next);
};

export const getProfile = async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      isAuthor: req.user.isAuthor,
      createdAt: req.user.createdAt,
    },
  });
};
