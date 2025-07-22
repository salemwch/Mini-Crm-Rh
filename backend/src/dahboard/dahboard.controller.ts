import { Controller, Get, UseGuards } from '@nestjs/common';
import { DahboardService } from './dahboard.service';
import { AccessTokenGuards } from 'src/guards/accessToken.guards';
import { RoleGuard } from 'src/guards/role.guards';
import { UserRole } from 'src/user/dto/create-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/guards/role.decorator';

@Controller('dashboard')
export class DahboardController {
  constructor(private readonly dahboardService: DahboardService) {}


  @Get('statistics')
  @UseGuards(AccessTokenGuards)
  @Roles(UserRole.ADMIN)
  @ApiOperation({summary: 'get global statistics for dashboard'})
  async getGlobalStatistics(){
    return this.dahboardService.getGlobalStatics();
  }
}
