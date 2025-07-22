import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Put,
  Query,
  UseGuards,
  Logger,
  HttpException,
  BadRequestException,
  NotFoundException,
  Req
} from '@nestjs/common';
import { JobOfferService } from './joboffer.service';
import { CreateJobOfferDto } from './dto/createjoboffer.dto';
import { UpdateJobOfferDto } from './dto/updatejoboffer.dto';
import { Roles } from 'src/guards/role.decorator';
import { UserRole } from 'src/user/dto/create-user.dto';
import { RoleGuard } from 'src/guards/role.guards';
import { AccessTokenGuards } from 'src/guards/accessToken.guards';
import { JobOffer } from './entities/joboffer.entity';
interface JwtPayloadWithRole {
  sub: string;
  email: string;
  role: UserRole;
}
interface RequestWithUser extends Request {
  user?: JwtPayloadWithRole;
}
@Controller('job-offer')
export class JobOfferController {
  private readonly logger = new Logger(JobOfferController.name);
  constructor(private readonly jobOfferService: JobOfferService) {}



  @Post('create')
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.RH)
async create(
  @Req() req: RequestWithUser,
  @Body() createJobOfferDto: CreateJobOfferDto
) {
  const rhUserId = req.user?.sub;

  this.logger.debug(`RH User [${rhUserId}] is creating job offer: ${createJobOfferDto.title}`);

  try {
    const jobOffer = await this.jobOfferService.create(createJobOfferDto, rhUserId ?? '');
    this.logger.log(`Job offer created with ID: ${jobOffer._id}`);
    console.log(rhUserId)
    return jobOffer;
  } catch (error) {
    console.log(error);
    this.logger.error('Failed to create job offer:', error.stack || error.message);
    throw new HttpException('Failed to create job offer', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  @Put('update/:id')
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.RH)
  async update(@Param('id') id: string, @Body() updateJobOfferDto: UpdateJobOfferDto) {
    this.logger.debug(`Updating job offer ID: ${id}`);

    try {
      const updated = await this.jobOfferService.update(id, updateJobOfferDto);
      this.logger.log(`Job offer updated: ${id}`);
      return updated;
    } catch (error) {
      this.logger.error(`Failed to update job offer ID ${id}:`, error.stack || error.message);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException('Failed to update job offer', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.RH, UserRole.ADMIN)
  @Get('get/:id')
  async getById(@Param('id') id: string) {
    return this.jobOfferService.getById(id);
  }
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.RH,UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.jobOfferService.delete(id);
    return { message: `Job offer with id ${id} has been deleted successfully.` };
  }
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.RH, UserRole.ADMIN)
  @Get()
  async getAll(
    @Query('filter') filter?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<JobOffer[]> {
    let parsedFilter = {};
    if (filter) {
      try {
        parsedFilter = JSON.parse(filter);
      } catch (e) {
        parsedFilter = {};
      }
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return this.jobOfferService.getAll(parsedFilter, pageNumber, limitNumber);
  }
  @Patch(':id/view-count')
  async incrementViewCount(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.jobOfferService.incrementViewCount(id);
      return { message: 'View count incremented successfully' };
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.RH,UserRole.ADMIN)
  @Get('active')
  async getActiveOffers(): Promise<JobOffer[]> {
    return this.jobOfferService.getActiveOffers();
  }
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.RH,UserRole.ADMIN)
  @Get('expired')
  async getExpiredOffers(): Promise<JobOffer[]> {
    return this.jobOfferService.getExpiredOffers();
  }
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.RH, UserRole.ADMIN)
  @Get('search')
  async searchOffers(
    @Query('query') query: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query() filters: any
  ): Promise<JobOffer[]> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    delete filters.query;
    delete filters.page;
    delete filters.limit;

    return this.jobOfferService.searchOffers(query, filters, pageNum, limitNum);
  }
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.RH, UserRole.ADMIN)
  @Get('statistics')
  async getStatistics() {
    return this.jobOfferService.getStatistics();
  }
  @Get('by-enterprise/:id')
  @UseGuards(AccessTokenGuards)
  async getByEnterprise(@Param('id') id: string) {
    return this.jobOfferService.getJobOffersByEnterprise(id);
  }

}
