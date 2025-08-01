import { Controller, Post, Body, Req, UseGuards, Param, Get, Query, Logger, BadRequestException, Res, HttpStatus, Patch, UnauthorizedException } from '@nestjs/common';
import { AccessTokenGuards } from 'src/guards/accessToken.guards';
import { UserRole } from 'src/user/dto/create-user.dto';
import { CreateMessageDto } from './Dto/CreateMessage.dto';
import { ConversationService } from './conversation.service';
import { CreateGroupDto } from './Dto/CreateGroup.dto';
import { Roles } from 'src/guards/role.decorator';
interface JwtPayloadWithRole {
  sub: string;
  email: string;
  role: UserRole;
}
interface RequestWithUser extends Request {
  user?: JwtPayloadWithRole;
}
@Controller('conversations')
export class ConversationController {
    private readonly logger = new Logger(ConversationController.name);
    constructor(private readonly conversationService: ConversationService) { }
    @UseGuards(AccessTokenGuards)
    @Roles(UserRole.ADMIN, UserRole.RH)
    @Post('group')
    async createGroup(
        @Body() dto: CreateGroupDto,
        @Req() req: RequestWithUser,
    ) {
        const userId = req.user?.sub;
        if (!userId) throw new UnauthorizedException();
        if (!dto.members.includes(userId)) {
            dto.members.push(userId);
        }
        return this.conversationService.createGroup(dto);
    }
    @UseGuards(AccessTokenGuards)
    @Roles(UserRole.ADMIN, UserRole.RH)
    @Post('message')
    async sendMessage(
        @Req() req: RequestWithUser,
        @Body() dto: CreateMessageDto,
    ) {
        if(!req.user) throw new Error('User not found');
        const userId = req.user?.sub;
        return this.conversationService.sendMessage(userId, dto);
    }
    @UseGuards(AccessTokenGuards)
    @Roles(UserRole.ADMIN, UserRole.RH)
    @Get('/global-group')
    async getGlobalGroup() {
        return this.conversationService.getOrCreateGlobalGroup();
    }
    @UseGuards(AccessTokenGuards)
    @Roles(UserRole.ADMIN, UserRole.RH)
    @Post('message/:id/seen')
    async markAsSeen(@Param('id') messageId: string, @Req() req: RequestWithUser) {
        if (!req.user) throw new Error('User not found');

        const userId = req.user?.sub;
        return this.conversationService.markMessageAsSeen(messageId, userId);
    }
    @UseGuards(AccessTokenGuards)
    @Roles(UserRole.ADMIN, UserRole.RH)
    @Get('group/:id/messages')
    async getGroupMessages(
        @Param('id') groupId: string,
        @Req() req: RequestWithUser,
    ) {
        if (!req.user) throw new Error('User not found');
        const userId = req.user.sub;

        return this.conversationService.getMessagesForGroup(groupId, userId);
    }
    @UseGuards(AccessTokenGuards)
    @Roles(UserRole.ADMIN, UserRole.RH)
    @Get("group/:id/messages/paginated")
    async getMessagePaginated(
        @Param('id') groupId: string,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Req() req: RequestWithUser,
    ){
        if(!req.user) throw new Error("user Not found");
        if (!groupId) {
            throw new BadRequestException('Group ID is required');
        }
        const userId = req.user.sub;
        return this.conversationService.getMessagePaginated(groupId, userId, page, limit);
    }
    @UseGuards(AccessTokenGuards)
    @Roles(UserRole.ADMIN, UserRole.RH)
    @Get()
    async getUserGroups(@Query('userId') userId: string) {
        this.logger.debug(`Received request to get groups for userId: ${userId}`);
        
        try {
            const groups = await this.conversationService.getGroupsByUser(userId);

            this.logger.debug(`Groups found for userId ${userId}: ${JSON.stringify(groups, null, 2)}`);

            return groups;
        } catch (error) {
            console.error('🔥 CreateMessage error:', error);

            this.logger.error(`Error fetching groups for userId ${userId}`, error.stack);
            throw error;
        }
    }   
    

    
}
