// ./Models/Project.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProject {
  userId: string;
  title: string;
  description?: string;
  startDate: string;
  relatedPlants: string[];
}

const ProjectSchema: Schema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: String, required: true },
  relatedPlants: { type: [String], default: [] },
});

const Project = mongoose.model<IProject & Document>('Project', ProjectSchema);
export default Project;