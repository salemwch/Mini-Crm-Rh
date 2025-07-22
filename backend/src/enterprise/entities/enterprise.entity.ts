import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { Types } from "mongoose";
import { User } from "src/user/entities/user.schema";

@Schema({timestamps: true})
export class Enterprise {
    @Prop({ unique: true, required: true})
    name: string;
    @Prop({required: true})
    secteur: string;
    @Prop({required: true})
    address: string;
    @Prop({default: true})
    isActive: boolean;
    @Prop({unique: true})
    website?: string;
    @Prop()
    industryCode?: string;
    @Prop()
    notes?: string;
    @Prop({type: Number, min: 0, max: 5})
    rating?: number;
    @Prop({ unique: true})
    phone?: string;
    @Prop([{type: Types.ObjectId, ref: 'Contact'}])
    contacts: Types.ObjectId[];
    @Prop([{type: Types.ObjectId, ref: User.name , required: true}])
    addBy: Types.ObjectId[];
    @Prop({type: Types.ObjectId, ref: 'Feedback'})
    feedbacks: Types.ObjectId[];   
    @Prop([String])
    documents: string[];
    @Prop({ default: false })
    isApproved: boolean;

}



export const EnterpriseSchema = SchemaFactory.createForClass(Enterprise);