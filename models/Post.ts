import mongoose, { Schema } from "mongoose";

interface PostInterface {
  title: String;
  description: String;
  authorId: String;
  tags: string[];
  comments: string[];
  viewsCount: number;
}

const PostSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    comments: {
      type: [String],
      default: [],
    },
    viewsCount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<PostInterface>("Post", PostSchema);
