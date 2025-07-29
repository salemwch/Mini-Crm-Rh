import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/entities/user.schema';

export type JobOfferDocument = HydratedDocument<JobOffer>;

@Schema({ timestamps: true })
export class JobOffer {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop([String])
  requirements: string[]

  @Prop()
  location?: string;

  @Prop({ required: true })
  salary: number;

  @Prop({ type: Types.ObjectId, ref: 'Enterprise', required: true })
  enterpriseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  addBy: Types.ObjectId;

  @Prop({ default: 'open' })
  status: 'open' | 'closed' | 'paused' | 'expired';

  @Prop({ default: 0 })
  viewCount: number;

  @Prop()
  expiryDate?: Date;
}

export const JobOfferSchema = SchemaFactory.createForClass(JobOffer);
