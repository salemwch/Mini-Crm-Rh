import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../dto/create-user.dto';
import { HydratedDocument, Types } from 'mongoose';
import { IUser } from '../interface/interface';
export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ type: String, enum: Object.values(UserRole), default: UserRole.RH })
  role: UserRole;
  @Prop({ default: true })
  isActive: boolean;
  @Prop({ type: Types.ObjectId, ref: 'Enterprise', required: false })
  enterprise: Types.ObjectId;
  @Prop()
  phoneNumber: string;
  @Prop({ type: Date, default: null })
  lastSeen: Date;
  @Prop()
  image: string;
  @Prop({ type: String, default: null})
  refreshToken: string |null;
  @Prop({default: false})
  isEmailVerified: boolean;
  @Prop({ default: false })
  isApproved: boolean;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop({type: String, default: null})
  pendingEmail: string | null; 
}
export const UserSchema = SchemaFactory.createForClass(User);
