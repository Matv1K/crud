import mongoose, { Schema } from "mongoose";

interface UserSchema {
  name: string;
  email: string;
  password: string;
}

const User: Schema = new mongoose.Schema<UserSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<UserSchema>("User", User);
