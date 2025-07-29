import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Event } from "./entities/event.entities";
import { NotificationGateway } from "src/Absence/notification/notification.getway";

@Injectable()
export class EventService {
    constructor(@InjectModel('Event') private readonly eventModel: Model<Event>,
        private readonly notificationGateway: NotificationGateway,
     ) {}

    async createEvent(createEventDto: any, imageUrl: string, userId: string) {
        const newEvent = new this.eventModel({
            ...createEventDto,
            imageUrl,
            addBy: userId,
        });
        this.notificationGateway.broadcastNewEventToRH(newEvent);

        return await newEvent.save();
    }
    async findTodayEvents() {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        return this.eventModel
            .find({
                createdAt: { $gte: start, $lte: end },
            })
            .populate('addBy', 'name email')
            .exec();
    }



}