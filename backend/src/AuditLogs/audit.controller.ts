import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuditLogService } from "./audit.service";
import { CreateAuditLogDto } from "./Dto/create.dto";
import { RoleGuard } from "src/guards/role.guards";
import { Roles } from "src/guards/role.decorator";
import { UserRole } from "src/user/dto/create-user.dto";

@Controller('audit-log')
@ApiTags('Audit Logs')
export class AuditLogController {
    constructor(private readonly auditLogService: AuditLogService){}



    @Post()
    @ApiOperation({summary: 'Create a audit Log Entry'})
    create(@Body() createAuditLogDto : CreateAuditLogDto) {
        return this.auditLogService.createLog(createAuditLogDto);
    }

    @Get()
    @ApiOperation({summary: 'Get All Aduit Logs'})
    getAll(){
        return this.auditLogService.getAll();
    }
    @Get('getOne/:id')
    @ApiOperation({summary: 'Get One Audit Log'})
    findOne(@Param('id') id: string){
        return this.auditLogService.findOne(id);
    }
    @UseGuards(RoleGuard)
    @Roles(UserRole.ADMIN)
    @Get('recents-auditlog')
    async getRecentsAuditLogs(@Query('limit') limit: string){
        const parsedLimit = parseInt(limit) || 5;
        return this.auditLogService.getRecentsAuditLog(parsedLimit);
    }
}