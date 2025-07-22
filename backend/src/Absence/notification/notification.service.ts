import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotificationGateway } from './notification.getway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<Notification>,
  ) {}
  async create(
    CreateNotificationDto: CreateNotificationDto
  ): Promise<Notification> {
    const newNotification = new this.notificationModel({
      user: new Types.ObjectId(CreateNotificationDto.user),
      message: CreateNotificationDto.message,
      type: CreateNotificationDto.type || 'info',
    });
    const saved = await newNotification.save();
    return saved;
  }
  async findByUser(UserId: string): Promise<Notification[]> {
    return this.notificationModel.find({ user: UserId }).exec();
  }
  async markAsRead(notificationId: string): Promise<Notification | null> {
    return this.notificationModel
      .findByIdAndUpdate(notificationId, { read: true }, { new: true })
      .exec();
  }
  async delete(notificationId: string): Promise<void> {
    await this.notificationModel.findByIdAndDelete(notificationId).exec();
  }
}
