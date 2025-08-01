import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from "src/user/entities/user.schema";
export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
    @Prop({ required: true })
    name: string;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: User.name }])
    members: mongoose.Schema.Types.ObjectId[];

    @Prop({ type: Types.ObjectId, ref: 'Message' })
    lastMessage: Types.ObjectId;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
