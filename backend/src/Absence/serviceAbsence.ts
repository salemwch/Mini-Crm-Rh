import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAbsenceDto } from "./Dto/createAbsence.dto";
import { UpdateAbsenceStatusDto } from "./Dto/update.dto";
import { Absence } from "./entities/absence.entitie";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { NotificationGateway } from "./notification/notification.getway";
import { NotificationService } from "./notification/notification.service";
import { User } from "src/user/entities/user.schema";
import { UserRole } from "src/user/dto/create-user.dto";

@Injectable()
export class AbsenceService {
    constructor(@InjectModel(Absence.name) private model: Model<Absence>,
        @InjectModel(User.name) private userModel: Model<User>,
                                        private notificationService: NotificationService,
                                        private notificationGetway: NotificationGateway,
) { }

    async create(dto: CreateAbsenceDto, userId: string): Promise<Absence> {
        const absence = await this.model.create({ ...dto, user: userId });
        console.log('Absence created:', absence);
        const requestingUser = await this.userModel.findById(userId);
        if (!requestingUser) {
            throw new Error('User not found');
        }
        const adminMessage = {
            message: `New absence request from ${requestingUser.name} from ${absence.startDate.toDateString()} to ${absence.endDate.toDateString()}. Status: Pending.`,
            type: 'absence_request_pending',
            absenceId: absence.id,
            fromUserId: userId,
        };
        const adminUsers = await this.userModel.find({
            role: UserRole.ADMIN,
            _id: { $ne: userId },
        });
        for (const admin of adminUsers) {
            await this.notificationService.create({
                user: admin._id.toString(),
                ...adminMessage,
            });
            this.notificationGetway.notifyUser(admin._id.toString(), adminMessage);
        }
        console.log(`🔔 Notifications sent to ${adminUsers.length} admins`);

        if (requestingUser.role === UserRole.RH) {
            const rhMessage = {
                message: `Your absence request from ${absence.startDate.toDateString()} to ${absence.endDate.toDateString()} has been submitted.`,
                type: 'absence_submission_confirmation',
                absenceId: absence.id,
            };
            await this.notificationService.create({
                user: userId,
                ...rhMessage,
            });
            this.notificationGetway.notifyUser(userId, rhMessage);
            console.log(`🔔 Confirmation notification sent to RH user: ${userId}`);
        }

        return absence;
    }





    async  findByUser(userId: string): Promise<Absence[]> {
        return this.model.find({ user: userId }).sort({ createdAt: -1 });
    }

    async  findAll(): Promise<Absence[]> {
        return this.model.find().populate('user').sort({ createdAt: -1 });
    }

    async updateStatus(id: string, dto: UpdateAbsenceStatusDto): Promise<Absence> {
        const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
        if (!updated) {
            throw new NotFoundException('Absence not found');
        }
        return updated;
    }

    
}
