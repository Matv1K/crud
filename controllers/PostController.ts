import { Request, Response } from "express";

import { validationResult } from "express-validator";

import Post from "../models/Post";

export const createPost = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(JSON.stringify(errors));
    }

    const { authorId, title, description, tags, comments, viewsCount } =
      req.body;

    const doc = await new Post({
      authorId,
      tags,
      title,
      description,
      comments,
      viewsCount,
    });

    const post = await doc.save();

    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Not possible to create a post",
    });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can not get posts",
    });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({
        message: "Invalid ID",
      });
    }

    const { title, description, tags, comments } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        description,
        tags,
        comments,
      },
      { new: true }
    );

    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(500).json({
      message: "Can not update the post",
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({
        message: "Invalid ID",
      });
    }

    const deletedPost = await Post.deleteOne({ _id: id });

    res.status(201).json(deletedPost);
  } catch (error) {
    res.status(500).json({
      message: "Can not delete the post",
    });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({
        message: "Invalid ID",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post does not exist",
      });
    }

    const { viewsCount } = post;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        viewsCount: viewsCount + 1,
      },
      { new: true }
    );

    console.log(updatedPost);

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: "Can not get the post",
    });
  }
};
