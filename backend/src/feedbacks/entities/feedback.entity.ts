import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { User } from "src/user/entities/user.schema";

@Schema({timestamps: true})
export class Feedback {
    @Prop({required: true})
    content: string;
    @Prop()
    rating?: number;
    @Prop([String])
    tags?: string[];
    @Prop({default: true})
    isActive: boolean;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
    user: User;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise' })
    enterpriseId: Types.ObjectId;
    @Prop({type: Types.ObjectId, ref: 'Contact', required: true})
    contactId: Types.ObjectId;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);