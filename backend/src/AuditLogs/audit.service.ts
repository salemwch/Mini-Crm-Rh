import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { AuditLog } from "./entities/entities.schema";
import { CreateAuditLogDto } from "./Dto/create.dto";

@Injectable()
export class AuditLogService{
    constructor(@InjectModel('AuditLog') private auditLogModel: Model<AuditLog>){}


    async createLog(createLogDto: CreateAuditLogDto) {
        const createdLog = new this.auditLogModel({
            ...createLogDto,
            userId: new Types.ObjectId(createLogDto.userId),
        });
        await createdLog.save();
    }


    async getAll(){
        const getAllAuditLog = await this.auditLogModel.find();
        return getAllAuditLog;
    }
    async findOne(id: string){
        const findOneAuditLog = await this.auditLogModel.findById(id);
        return findOneAuditLog;
    }


    async getRecentsAuditLog(limit : number){
        return this.auditLogModel.find()
        .sort({createdAt: -1})
        .limit(limit)
        .populate('userId', 'name role email')
        .exec();
    }
}

