import { Types } from "mongoose";

export class CreateAuditLogDto {
    userId: Types.ObjectId;
    action: string;
    description: string;
}
  