import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { Roles } from 'src/guards/role.decorator';
import { User } from 'src/user/entities/user.schema';
import { UserRole } from 'src/user/dto/create-user.dto';
import { response, Response } from 'express';
import { Enterprise } from './entities/enterprise.entity';
import { AccessTokenGuards } from 'src/guards/accessToken.guards';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginiationQueryDto } from 'src/common/dto/paginationQuery.dto';
import { RoleGuard } from 'src/guards/role.guards';
interface JwtPayloadWithRole {
  sub: string;
  email: string;
  role: UserRole;
}
interface RequestWithUser extends Request {
  user?: JwtPayloadWithRole;
}
@Controller('enterprise')
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @UseGuards(AccessTokenGuards)
  @Roles(UserRole.RH, UserRole.ADMIN)
  @Post('enterprise-create')
  async createEnterprise(@Res() response: Response, @Body() dto: CreateEnterpriseDto, @Req() req ): Promise<Response>{
    try{
      const createownEnterprise = await this.enterpriseService.create(dto, req.user.sub);

      return response.status(HttpStatus.CREATED).json({
        message: ' User Created Successfully',
        createownEnterprise,
        statusCode: 201,
      });
    }catch(error){
      return  response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something wen wrong wen creating enterprise please try again later',
        error: (error as Error).message,
        details: error.response || error.errors || error,
        statusCode: 400,
      })
    }
  }
  @UseGuards(AccessTokenGuards)
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Get()
  async findAll(@Res() response: Response): Promise<Response>{
    try{
      const findAllEnterprise = await this.enterpriseService.findAll();
      return response.status(HttpStatus.OK).json({
        message: 'Listing of All Enterprises fetched',
        findAllEnterprise,
        statusCode: 200,
      });
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something went wrong when fetching all enterprises please try again later',
        error: (error as Error).message,
        statusCode: 400,
      });
    }
  }
  @UseGuards(AccessTokenGuards)
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Get('enterprise/:id')
  async FindOneEnterPrise(@Res() response: Response, @Param('id') id: string): Promise<Response>{
    try{
      const findEnterpriseById = await this.enterpriseService.findOneEnterprise(id);
      return response.status(HttpStatus.OK).json({
        message: 'enterprise found successfully',
        findEnterpriseById,
        statusCode: 200,
      })
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something went wrong when fetching enterprise please try again later',
        error: (error as Error).message,
        statusCode: 400,
      })
    }
  }
  @UseGuards(AccessTokenGuards)
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Patch('update-enterprise/:id')
  async updateEnterprise(@Res() response: Response, @Param('id') id:string, @Body() dto: UpdateEnterpriseDto): Promise<Response>{
    try{
      const updateUnterprise = await this.enterpriseService.updateEnterPrise(id, dto);
      return response.status(HttpStatus.ACCEPTED).json({
        message: ' enterprise updated successfully',
        updateUnterprise,
        statusCode: 202,
      })
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something went wrong when updating enterprise please try again later',
        error: (error as Error).message,
        statusCode: 400,
      })
    }
  }
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Delete('delete/:id')
  async remove(@Res() response: Response, @Param('id') id: string): Promise<Response>{
    try{
      const deleteEnterprise = await this.enterpriseService.removeEnterprise(id);
      return response.status(HttpStatus.OK).json({
        message: 'enterprise deleted successfully',
        deleteEnterprise,
        statusCode: 200,
      })
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something went wrong when deleting enterprise please try again later',
        error : (error as Error).message,
        statusCode: 400,
      })
    }
  }
  @UseGuards(AccessTokenGuards)
  @Roles(UserRole.RH, UserRole.ADMIN)
  @Get()
  @ApiBearerAuth('jwt')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'secteur', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  async findAllQuery(@Query() query: PaginiationQueryDto, @Req() req: RequestWithUser) {
    return this.enterpriseService.findAllEnterprise(query, req);
  }
  @UseGuards(AccessTokenGuards)

  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  @Get('statistics/sector-distribuation')
  async getEnterpriseCountBySector(){
    return this.enterpriseService.getEnterpriseCountBySector();
  }
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.ADMIN)
  @Get('statistics/recent')
  async getRecentEnterprises(@Query('limit') limit: string) {
    const parsedLimit = parseInt(limit) || 5;
    return this.enterpriseService.getRecentEnterprises(parsedLimit);
  }
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  @Get('statistics/inactive-count')
  async getInactiveEnterprises() {
    return this.enterpriseService.countInactiveEnterprises();
  }
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.ADMIN)
  @Get('statistics/average-rating')
  async getAverageRating() {
    return this.enterpriseService.getAverageEnterpriseRating();
  }
  @Patch(":id/approve")
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.ADMIN)
  async approveEnterprise(@Param('id') id: string){
    return this.enterpriseService.approveEnterprise(id);
  }
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.enterpriseService.approvedEnterprise(id);
  }

  @UseGuards(AccessTokenGuards)
  @Get('my-enterprises')
  async getEnterprisesByUser(@Req() req: RequestWithUser) {
    const userId = req.user?.sub;
    if(!userId){
      throw new Error(`User with id ${userId} not found`)
    }
    return this.enterpriseService.getEnterprisesByUser(userId);
  }
  @Get('with-contacts')
  async getWithContacts() {
    return this.enterpriseService.getEnterprisesWithContacts();
  }
  @Get('/with-feedbacks')
  async getEnterprisesWithFeedbacks() {
    return this.enterpriseService.getEnterprisesWithFeedbacks();
  }
}
