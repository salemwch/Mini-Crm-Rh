import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards, Query, Req, ForbiddenException } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { UserRole } from 'src/user/dto/create-user.dto';
import { Response } from 'express';
import { Roles } from 'src/guards/role.decorator';
import { HttpAdapterHost } from '@nestjs/core';
import { AccessTokenGuards } from 'src/guards/accessToken.guards';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginiationQueryDto } from 'src/common/dto/paginationQuery.dto';
import { Logger } from '@nestjs/common';
interface JwtPayloadWithRole {
  sub: string;
  email: string;
  role: UserRole;
}
interface RequestWithUser extends Request {
  user? : JwtPayloadWithRole;
}
@Controller('feedbacks')
export class FeedbacksController {
  private readonly logger = new Logger(FeedbacksController.name);
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post('create')
  @UseGuards(AccessTokenGuards)
  @Roles(UserRole.ADMIN, UserRole.RH)
  create(@Body() createFeedbackDto: CreateFeedbackDto, @Req() req: RequestWithUser) {
    this.logger.debug(`Creating feedback for user ID: ${req.user?.sub}`);
    const userId = req.user?.sub;
    this.logger.debug(`Creating feedback for user ID: ${userId}`);
    if(!userId){
      throw new ForbiddenException('User not found');
    }
    this.logger.error(`Creating feedback for user ID: ${userId}`);
    return this.feedbacksService.createFeedback(createFeedbackDto, userId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RH)
  async findAll(@Res() response: Response): Promise<Response>{
    try{
    const findALllFeedBacks = await this.feedbacksService.findAll();
    return response.status(HttpStatus.ACCEPTED).json({
      message: 'fetching list of all feebacks goes succesffully',
      findALllFeedBacks,
      statusCode: 202,
    });
  }catch(error){
    return response.status(HttpStatus.BAD_REQUEST).json({
      message: 'something went wrong when fetching feedbacks  please try again later',
      error : (error as Error).message,
      statusCode: 400,
    });
  }
  }
  @Get('feedback/:id')
  @Roles(UserRole.ADMIN, UserRole.RH)
  async findOneFeedback(@Res() response: Response, @Param('id') id: string): Promise<Response>{
    try{
      const getOneFeedback = await this.feedbacksService.findOneFeedBAck(id);
      return response.status(HttpStatus.ACCEPTED).json({
        message: 'fetching list of a feedback goes successfully',
        getOneFeedback,
        statusCode: 202,
      });
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something went wrong when fetching feedback please try again later',
        error: (error as Error).message,
        statusCode: 400,
      });
    }
  }
  @Get('enterprise/:enterpriseId')
  @Roles(UserRole.ADMIN, UserRole.RH)
  async findOneEnterprise(@Res() response: Response, @Param('enterpriseId') id:string): Promise<Response>{
    try{
      const findByEnterprise = await this.feedbacksService.findByEnterprise(id);
      return response.status(HttpStatus.OK).json({
        message: 'fetching by enterprise id goes successfully',
        findByEnterprise,
        statusCode: 200,
      })
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something went wrong when fetching by enterprise id please try again later',
        error: (error as Error).message,
        statusCode: 400,
      });
    }
  }
  @Patch('update/:id')
  @Roles(UserRole.ADMIN, UserRole.RH)
    async updatefeedBack(@Res() response: Response, @Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto ):Promise<Response>{
      try{
        const updatedfeedBack = await this.feedbacksService.updateFeedBack(id, updateFeedbackDto);
        return response.status(HttpStatus.ACCEPTED).json({
          message: 'feedback updated successfully',
          updatedfeedBack,
          statusCode: 202,
        });
      }catch(error){
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'something went wrong when updating feedback please try again later',
          error: (error as Error).message,
          statusCode: 400,
        });
      }
    }

    @Delete('id')
    @Roles(UserRole.ADMIN, UserRole.RH)
    async removeFeedback(@Res() response: Response, @Param('id') id: string): Promise<Response>{
      try{
        const deletedFeedback = await this.feedbacksService.remove(id);
        return response.status(HttpStatus.OK).json({
          message: 'feedback deleted successfully',
          deletedFeedback,
          statusCode: 200,
        });
      }catch(error){
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'something went wrong when deleting feedback please try again later',
          error : (error as Error).message,
          statusCode: 400,
        });
      }
    }

    @Get()
    @UseGuards(AccessTokenGuards)
    @ApiBearerAuth('jwt')
    @ApiQuery({ name: 'page', required: false})
    @ApiQuery({ name: 'limit', required: false})
    @ApiQuery({ name: 'search', required: false})
    @ApiQuery({ name: 'isActive', required: false})
    async findAllfeedbacks(@Query() query : PaginiationQueryDto){
      return this.feedbacksService.findAllFeedbacks(query);
    }
  @Get('by-enterprise/:enterpriseId')
  getFeedbacksByEnterprise(@Param('enterpriseId') enterpriseId: string) {
    return this.feedbacksService.getByEnterprise(enterpriseId);
  }
  @UseGuards(AccessTokenGuards)
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Get('last-5')
  getLastFiveFeedbacks() {
    return this.feedbacksService.getLastFiveFeedbacks();
  }

}

