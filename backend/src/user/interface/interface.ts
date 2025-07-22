import { Types } from 'mongoose';
import { UserRole } from '../dto/create-user.dto';
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  phoneNumber: string;
  lastSeen: Date;
  enterprise: Types.ObjectId;
  refreshToken: string| null;
  image: string;
  isEmailVerified: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  pendingEmail: string | null;
}
