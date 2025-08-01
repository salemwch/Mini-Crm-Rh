import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './Schema/Message.entity';
import { Group, GroupDocument } from './Schema/groupe.schema';
import { CreateMessageDto } from './Dto/CreateMessage.dto';
import { CreateGroupDto } from './Dto/CreateGroup.dto';


@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);

  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}
    async getOrCreateGlobalGroup(): Promise<GroupDocument> {
        let group = await this.groupModel.findOne({ name: 'Global Chat' });
        if (!group) {
            group = await this.groupModel.create({
                name: 'Global Chat',
                members: [],
            });
        }
        return group;
    }

    async createGroup(dto: CreateGroupDto) {
        const newGroup = await this.groupModel.create({
            name: dto.name,
            members: dto.members,
        });

        return newGroup;
    }
    async sendMessage(user: any, dto: CreateMessageDto) {
        const group = await this.getOrCreateGlobalGroup();

        const userId = user._id || user.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid userId');
        }
        const senderObjectId = new mongoose.Types.ObjectId(userId);

        const message = await this.messageModel.create({
            sender: senderObjectId,
            group: group._id,
            content: dto.content,
            seenBy: [senderObjectId],
        });

        group.lastMessage = message._id as Types.ObjectId;
        await group.save();

        return message.populate('sender', 'fullName image');
    }


    async markMessageAsSeen(messageId: string, userId: string) {
        return this.messageModel.findByIdAndUpdate(
            messageId,
            { $addToSet: { seenBy: userId } },
            { new: true },
        ).populate('seenBy', 'fullName image');
    } 
    async getMessagesForGroup(_: string, userId: string) {
        const group = await this.getOrCreateGlobalGroup();

        const messages = await this.messageModel
            .find({ group: group._id })
            .sort({ createdAt: 1 })
            .populate('sender', 'fullName image')
            .populate('seenBy', 'fullName image');

        return messages;
    }
    async getMessagePaginated(_: string, userId: string, page = 1, limit = 10) {
        const group = await this.getOrCreateGlobalGroup();
        const skip = (page - 1) * limit;

        const messages = await this.messageModel.find({ group: group._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('sender', 'fullName image')
            .populate('seenBy', 'fullName image')
            .lean();
        await this.messageModel.updateMany(
            {
                group: group._id,
                seenBy: { $ne: userId },
            },
            {
                $push: { seenBy: userId },
            }
        );

        const ordered = messages.reverse();
        const total = await this.messageModel.countDocuments({ group: group._id });

        return {
            page,
            limit,
            totalMessages: total,
            totalPages: Math.ceil(total / limit),
            messages: ordered,
        };
    }


    async getGroupsByUser(userId: string) {
        this.logger.debug(`Getting groups for user: ${userId}`);
        const groups = await this.groupModel.find({ members: userId });
        this.logger.debug(`Groups found: ${JSON.stringify(groups)}`);
        return groups;
    }
}
