import mongoose, { Schema, Document } from 'mongoose';

// 1. Define an interface for the Plant document
export interface IPlant extends Document {
  commonName: string;
  scientificName: string;
  description: string;
  careInstructions: string;
  pestInfo: string;
  userId: string; // Assuming userId is a string. If it's a Mongoose ObjectId, use mongoose.Types.ObjectId.
  isVerified: boolean;
}

// 2. Define the Mongoose Schema
const PlantSchema: Schema = new Schema({
  commonName: { type: String, required: true }, // Added 'required: true' as a common practice for commonName
  scientificName: { type: String },
  description: { type: String },
  careInstructions: { type: String },
  pestInfo: { type: String },
  userId: { type: String, required: true }, // Assuming userId is required
  isVerified: { type: Boolean, default: false } // Added 'default: false' as a common practice for boolean flags
});

// 3. Create and export the Mongoose Model
const Plant = mongoose.model<IPlant>('Plant', PlantSchema);

export default Plant;