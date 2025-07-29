import { Controller, Post, UseInterceptors, UploadedFile, Body, Req, UseGuards, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { EventService } from './event.service';
import { UserRole } from 'src/user/dto/create-user.dto';
import { AccessTokenGuards } from 'src/guards/accessToken.guards';
import { Roles } from 'src/guards/role.decorator';
interface JwtPayloadWithRole {
  sub: string;
  email: string;
  role: UserRole;
}
interface RequestWithUser extends Request {
  user?: JwtPayloadWithRole;
}
@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) {}
    @UseGuards(AccessTokenGuards)
    @Roles(UserRole.RH, UserRole.ADMIN)
    @Post('create')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads/events',
            filename: (req, file, cb) => {
                const fileName = Date.now() + '-' + file.originalname;
                cb(null, fileName);
            },
        }),
    }))
    async createEvent(
        @UploadedFile() file: Express.Multer.File,
        @Body() body,
        @Req() req : RequestWithUser ,
    ) {
        const imageUrl = file ? `http://localhost:3000/uploads/events/${file.filename}` : '';
        const userId = req.user?.sub;
        if(!userId){
            throw new Error(`User with id ${userId} not found`);
        }
        return this.eventService.createEvent(body, imageUrl, userId);
    }
    @Get('latest')
    async getLatestEvent() {
        return this.eventService.findTodayEvents();
    }

}
