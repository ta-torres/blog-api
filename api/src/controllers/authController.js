import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import passport from "passport";

const prisma = new PrismaClient();
// create jwt token on signup login, author as false
const signup = async (req, res) => {
  try {
    const { email, username, displayName, password } = req.body;

    // check if either one of email or username is already in use
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          error: "User with this email already exists",
        });
      }
      if (existingUser.username === username) {
        return res.status(400).json({
          error: "Username already taken",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        displayName: displayName || null,
        password: hashedPassword,
        isAuthor: false,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
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
        username: user.username,
        displayName: user.displayName,
        isAuthor: user.isAuthor,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = (req, res, next) => {
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
        username: user.username,
        isAuthor: user.isAuthor,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    //console.log(user);
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        isAuthor: user.isAuthor,
      },
    });
  })(req, res, next);
};

const getProfile = async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      displayName: req.user.displayName,
      isAuthor: req.user.isAuthor,
      createdAt: req.user.createdAt,
    },
  });
};

const authController = {
  signup,
  login,
  getProfile,
};

export default authController;
