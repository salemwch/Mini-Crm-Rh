import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { User } from "src/user/entities/user.schema";
import { Group } from "./groupe.schema";

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
    sender: Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Group.name, required: true })
    group: Types.ObjectId;

    @Prop({ required: true, trim: true })
    content: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }], default: [] })
    seenBy: Types.ObjectId[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
