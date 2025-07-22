import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

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
    @Prop({type: Types.ObjectId, ref: 'Enterprise', required: true})
    enterpriseId: Types.ObjectId;
    @Prop({type: Types.ObjectId, ref: 'Contact', required: true})
    ContatactId: Types.ObjectId;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);