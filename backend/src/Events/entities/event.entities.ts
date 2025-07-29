import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/entities/user.schema';

@Schema({ timestamps: true })
export class Event extends Document {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    date: string;

    @Prop({ required: true })
    time: string;

    @Prop()
    imageUrl: string;

    @Prop([{type: Types.ObjectId, ref: User.name , required: true}])
        addBy: Types.ObjectId[];
}

export const EventSchema = SchemaFactory.createForClass(Event);