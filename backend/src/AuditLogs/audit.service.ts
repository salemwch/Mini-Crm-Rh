import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { AuditLog } from "./entities/entities.schema";
import { CreateAuditLogDto } from "./Dto/create.dto";
import { QueryAuditLogDto } from "./Dto/QueryAuditLogDto";

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
        const getAllAuditLog = await this.auditLogModel.find().populate("userId", "name email role");
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
    async findAll(query: QueryAuditLogDto): Promise<AuditLog[]> {
        const { action } = query;

        const filter: Record<string, any> = {};

        if (action) {
            filter.action = { $regex: action, $options: 'i' };
        }

        console.log('FILTER APPLIED:', filter);

        return this.auditLogModel
            .find(filter)
            .populate('userId', 'name email role')
            .sort({ createdAt: -1 })
            .exec();
    }


}

