// absence.controller.ts
import {
    Controller,
    Post,
    Get,
    Patch,
    Param,
    Body,
    UseGuards,
    Req,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { CreateAbsenceDto } from './Dto/createAbsence.dto';
import { UpdateAbsenceStatusDto } from './Dto/update.dto';
import { AbsenceService } from './serviceAbsence';
import { RoleGuard } from 'src/guards/role.guards';
import { UserRole } from 'src/user/dto/create-user.dto';
import { Roles } from 'src/guards/role.decorator';
import { AccessTokenGuards } from 'src/guards/accessToken.guards';
import { Absence } from './entities/absence.entitie';
import { NotificationService } from './notification/notification.service';
import { Logger } from '@nestjs/common';

interface JwtPayloadWithRole {
  sub: string;
  email: string;
  role: UserRole;
}
interface RequestWithUser extends Request {
  user? : JwtPayloadWithRole;
}
@Controller('absence')
export class AbsenceController {
    private readonly Logger = new Logger(AbsenceController.name);
    constructor(private readonly absenceService: AbsenceService,
                private readonly notificationService: NotificationService,

    ) {  }

    @Post()
    @UseGuards( AccessTokenGuards, RoleGuard)
    @Roles(UserRole.RH)
    async createAbsence(@Body() dto: CreateAbsenceDto, @Req() req: RequestWithUser) :Promise<Absence > {
        this.Logger.log(`Creating absence for user with ID: ${req.user?.sub}`);
        const userId = req.user?.sub;
        if(!userId){
            throw new ForbiddenException('User not found');
        }
        this.Logger.error(`User with ID: ${userId} not found`);
        const absence = await this.absenceService.create(dto, userId )
        this.Logger.warn(`Absence created for user with ID: ${userId}`);
        console.log("absenc:", absence);
        return absence;
    }

    @Get('user')
    @UseGuards( AccessTokenGuards,RoleGuard)
    @Roles(UserRole.RH, UserRole.ADMIN)
    async getUserAbsences(@Req() req) {
        const userId = req.user._id;
        return this.absenceService.findByUser(userId);
    }
    @UseGuards(AccessTokenGuards)

    @Get()
    async getAllAbsences() {
        return this.absenceService.findAll();
    }

    @Patch(':id/status')
    @UseGuards(RoleGuard)
    @Roles(UserRole.ADMIN)
    async updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateAbsenceStatusDto,
    ) {
        const updated = await this.absenceService.updateStatus(id, dto);
        if (!updated) {
            throw new NotFoundException(`Absence with id ${id} not found`);
        }
        return updated;
    }
}
