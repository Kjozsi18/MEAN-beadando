import mongoose, { Schema, Document } from 'mongoose';

// 1. Define an interface for the User document
export interface IUser extends Document {
  email: string;
  name: string;
  address?: string; // Address can be optional, hence the '?'
  nickname?: string; // Nickname can be optional
  password: string; // Password is usually required and hashed
  role: boolean; // Example: enforce specific roles, or just 'string' if more flexible
}

// 2. Define the Mongoose Schema
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true }, // Email is typically required and unique
  name: { type: String, required: true }, // Name is usually required
  address: { type: String }, // No 'required' means it's optional by default
  nickname: { type: String, unique: true, sparse: true }, // Nickname can be unique but optional
  password: { type: String, required: true }, // Password is required
  role: { type: Boolean } // Example: restrict role to specific values
});

// 3. Create and export the Mongoose Model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;