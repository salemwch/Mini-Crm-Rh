import { Document } from 'mongoose';
export interface IJobOffer extends Document {
  title: string;
  description: string;
  location?: string;
  requirement: string[];
  salary: number;
  viewCount?: number;
}
