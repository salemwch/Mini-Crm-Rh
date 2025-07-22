import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from 'src/user/entities/user.schema';

@Schema({ timestamps: true })
export class Absence extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
    user: Types.ObjectId;

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;

    @Prop()
    reason: string;

    @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
    status: string;

    @Prop()
    responseMessage: string;
}

export const AbsenceSchema = SchemaFactory.createForClass(Absence);
