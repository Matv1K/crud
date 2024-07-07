import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import postsValidation from "./validations/postsValidation";
import userValidation from "./validations/userValidation";

import User from "./models/User";

import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPost,
} from "./controllers/PostController";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/posts")
  .then(() => console.log("database is connected"))
  .catch((error) => console.log(error));

app.post("/posts", postsValidation, createPost);
app.put("/posts/:id", updatePost);
app.delete("/posts/:id", deletePost);
app.get("/posts", getPosts);
app.get("/posts/:id", getPost);

app.post(
  "/auth/register",
  userValidation,
  async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(req.body.password, salt);

      const doc = await new User({
        name,
        email,
        password: passwordHash,
      });

      const user = await doc.save();

      const token = jwt.sign(
        {
          id: user._id,
        },
        "secret",
        { expiresIn: "30d" }
      );

      const { password, ...userData } = user.toObject();

      res.status(201).json({ ...userData, token });
    } catch (error) {
      res.status(500).json({
        message: "Can not sign up",
      });
    }
  }
);

app.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!isPasswordValid) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      "secret",
      { expiresIn: "30d" }
    );

    const { password: _, ...userData } = user.toObject();

    res.status(201).json({ ...userData, token });
  } catch (error) {
    res.status(500).json({
      message: "Not possible to login",
    });
  }
});

app.get("/auth/users", async (req: Request, res: Response) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Can not get users",
    });
  }
});

app.listen(3333, () => console.log("app is listening on port 3333"));
