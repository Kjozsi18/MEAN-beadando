import mongoose, { Schema, Document } from 'mongoose';

// 1. Define an interface for the Post document
export interface IPost extends Document {
  title: string;
  content: string;
  username: string; // Assuming username is a string.
}

// 2. Define the Mongoose Schema
const PostSchema: Schema = new Schema({
  title: { type: String, required: true }, // Title is usually required
  content: { type: String, required: true }, // Content is usually required
  username: { type: String, required: true } // Username is usually required
});

// 3. Create and export the Mongoose Model
const Post = mongoose.model<IPost>('Post', PostSchema);

export default Post;