import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PreferredContactMethod } from "../Enum/PreferedContactMethod";
import { Types } from "mongoose";
import { User } from "src/user/entities/user.schema";

@Schema({timestamps: true})
export class Contact {
    @Prop({required: true})
    name: string;
    @Prop({required: true, unique: true})
    email: string;
    @Prop({ required: true})
    phone: string;
    @Prop({required: true})
    position: string;
    @Prop({type: String, enum: PreferredContactMethod, default: PreferredContactMethod.EMAIL})
    preferedContactMethod: PreferredContactMethod;
    @Prop({default: true})
    isActive: boolean;
    @Prop({type: Types.ObjectId, ref: 'EnterPrise', required:true})
    enterpriseId: Types.ObjectId;
    @Prop({type: Types.ObjectId, ref: User.name, required: true})
    addBy?: Types.ObjectId;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);