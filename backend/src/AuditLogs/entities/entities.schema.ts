import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "src/user/entities/user.schema";

@Schema({timestamps: true})

export class AuditLog extends Document{
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;
    @Prop({required: true})
    action: string;
    @Prop()
    entityId: string;
    @Prop()
    entityType: string;
    @Prop({type: Object})
    destails: object;
    @Prop()
    ipAdress: string;
    @Prop({required: true})
    description: string;
}


export const AuditLogSchema =  SchemaFactory.createForClass(AuditLog);