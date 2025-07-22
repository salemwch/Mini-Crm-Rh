import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "src/user/entities/user.schema";

@Schema({timestamps: true})
export class DocumentEntity extends  Document {
    @Prop({required: true})
    name: string;
    @Prop({required: true})
    url: string;
    @Prop({type: Types.ObjectId, ref: 'Enterprise', required: true})
    enterpriseId: Types.ObjectId;
    @Prop({type: Types.ObjectId, ref: User.name})
    uploadedBy: Types.ObjectId;
    @Prop({ type: Types.ObjectId, ref: 'Feedback' })
    feedbackId?: Types.ObjectId;
    @Prop({ type: Types.ObjectId, ref: 'Contact' })
    contactId?: Types.ObjectId;
    @Prop({ type: Types.ObjectId, ref: 'JobOffer' })
    jobOfferId?: Types.ObjectId;
}
export const DocumentSchema = SchemaFactory.createForClass(DocumentEntity);
