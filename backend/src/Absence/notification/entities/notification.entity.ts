import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/user/entities/user.schema';

@Schema()
export class Notification extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;
  @Prop({ required: true })
  message: string;
  @Prop({ default: false })
  read: boolean;
  @Prop({ default: 'info' })
  type: string;

  @Prop({ default: Date.now })
  createdAt: Date;

}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
