import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  ResponseDecoratorOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { User } from './entities/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateUserDto } from './dto/update_user.dto';
import { response, Response } from 'express'
import { ApiConsumes, ApiBody, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AccessTokenGuards } from 'src/guards/accessToken.guards';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserRole } from './dto/updateUserRole';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/MailTrap/mail.service';
import { Request } from 'express';
import { Roles } from 'src/guards/role.decorator';
import { RoleGuard } from 'src/guards/role.guards';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly mailService: MailService
  ) {}
  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: CreateUserDto})
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req,file,cb)=>
          cb(null, `${new Date().getTime()}-${file.originalname}`),
      }),
    }),
  )
  async create(@Res() response: Response,
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Response> {
    try {
      if (file) {
        createUserDto.image = file.filename;
      }

      const createUser = await this.userService.create(createUserDto,req);
      return response.status(HttpStatus.CREATED).json({
        message: 'user created successfully',
        createUser,
        statusCode: 201,
      })
    } catch (error) {
      console.error('Error in create user:', error);
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'sometthing wenty wrong please try again later',
        error: (error as Error).message,
        statusCode: 400,
      });
    }
  }

  @Roles(UserRole.ADMIN, UserRole.RH)
  @Get('by-email')
  async getUserByEmail(@Res() response: Response, @Query('email') email: string): Promise<Response>{
   try{
    const user = await this.userService.findByEmail(email);
    return response.status(HttpStatus.OK).json({
      message: 'user Found Successfully',
      user,
      statusCode: 200,
    });
  }catch(error){
    return response.status(HttpStatus.NOT_FOUND).json({
      message: 'user not found',
      error: (error as Error).stack,
      statusCode: 404,
    });
  }
  }
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<User |null> {
    return await this.userService.findById(id);
  }
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Put('update/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type:  UpdateUserDto})
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) =>
          cb(null, `${new Date().getTime()}-${file.originalname}`),
      }),
    }),
  )
  async updateProfile(@Res() response: Response, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File): Promise<Response> {
    try {
      if (file) {
        updateUserDto.image = file?.filename;
      }else{
        delete updateUserDto.image;
      }
      const updatedUser = await this.userService.update(id, updateUserDto);
      return response.status(HttpStatus.ACCEPTED).json({
        message: 'user updated successfully',
        user: updatedUser,
        statusCode: 202,
      })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something went wrong  please try again later',
        error: (error as Error).message,
        statusCode: 400,
      })
    }
  }
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Delete('delete/:id')
  async deleteAccount(@Res() response: Response , @Param('id') id: string): Promise<Response>{
    try{
      const deleteUser = await this.userService.deleteAccount(id);
      return response.status(HttpStatus.OK).json({
        message: 'User Deleted Successfully',
        user: deleteUser,
        statusCode: 200,
      });
    } catch (error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: ` Something went wrong please try ahain later`,
        error: (error as Error).message,
        statusCode: 400,
      });
    }
  }
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Patch('activate/:id')
  async activateAccount(@Res() response: Response, @Param('id') id: string): Promise<Response>{
    try{
      const activeUser = await this.userService.updateStatus(id, true);
      return response.status(HttpStatus.OK).json({
        message: 'User Activated Successfully',
        activeUser,
        statusCode: 200,
      })
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something went wrong when trying to active user please try again later',
        error: (error as Error).message,
        statusCode: 400,
      });
    }
  }
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Patch('desactivate/:id')
  async desactivateAccount(@Res() response: Response, @Param('id') id:string): Promise<Response>{
    try{
      const desactivateAccount = await this.userService.updateStatus(id,false);
      return response.status(HttpStatus.OK).json({
        message: 'user desactivate successfully',
        desactivateAccount,
        statusCode: 200,
      })
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'a problem relase when desactivate this user try again later',
        error: (error as Error).message,
        statusCode: 400,
      });
    }
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Post('ping')
  async ping(@Res() response: Response, @Req() req){
    try{
      const userId = req.user.id;
      await this.userService.updateLastSeen(userId);
      return response.status(HttpStatus.OK).json({
        message: 'user pinged successfully',
        userId,
        statusCode: 200,
      })
    } catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something went wrong when user pinged',
        error: (error as Error).message,
        statusCode: 400,
      })
    }
  }
  @Patch('role/:id')
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('jwt')
  @ApiOperation({summary: 'update user role (Admin only)'})
  async updateRole(@Param('id') id: string ,@Body() dto: UpdateUserRole,@Res() response: Response ): Promise<Response>{
    try{
      const user = await this.userService.updateUserRole(id, dto);
      return response.status(HttpStatus.OK).json({
        message: 'user Role Updated Successfully',
        user,
        statusCode: 200,
      });
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something wen wrong when trying yo update user role please try again later',
        error: (error as Error).message,
        statsuCode: 400,
      });
    }
  }
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('jwt')
  @ApiOperation({summary: 'List Of all Users (admin only)'})
  @Get('get-all-users')
  async getAllUsers(@Res() response: Response): Promise<Response>{
    try{
      const user = await this.userService.findAll();
      return response.status(HttpStatus.OK).json({
        message: 'Listing Of all Users Goes succesfully',
        user,
        statusCode: 200,
      });
    }catch(error){
      return response.status(HttpStatus.NOT_FOUND).json({
        message: 'no users Found',
        error: (error as Error).message,
        statusCode: 404,
      });
    }
  }
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Admin can approve user account (admin only)' })
  @Patch('approved/:id')
  async approvedUser(@Res() response: Response, @Param('id') id: string): Promise<Response> {
    try {
      const approvedUser = await this.userService.approvedUser(id);

      return response.status(HttpStatus.ACCEPTED).json({
        message: 'User approved successfully',
        data: approvedUser,
        statusCode: HttpStatus.ACCEPTED,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Failed to approve user. Please try again later.',
        error: (error as Error).message,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Get('admin-exist')
  async doesAdminExist(){
    const adminExist = await this.userService.isAdminExist();
    return {adminExist};
  }
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('jwt')
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'isApproved', required: false, type: Boolean })
  @ApiQuery({ name: 'isEmailVerified', required: false, type: Boolean })
  @ApiOperation({ summary: 'Get all users with filters (admin only)' })
  async getAllUsersWithFilters(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('isActive') isActive?: boolean,
    @Query('isApproved') isApproved?: boolean,
    @Query('isEmailVerified') isEmailVerified?: boolean,
  ) {
    return this.userService.getAllUsersFiltered({
      page: Number(page),
      limit: Number(limit),
      search,
      isActive,
      isApproved,
      isEmailVerified,
    });
  }

  @Post('create-admin')
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDto })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) =>
          cb(null, `${new Date().getTime()}-${file.originalname}`),
      }),
    }),
  )
  async createAdmin(@Body() createAdmin: CreateUserDto, @Req() req: any, @UploadedFile() file: Express.Multer.File){
    
    if (file) {
      createAdmin.image = file.filename;
    }
    const createAdminId = req.user.sub;
    const newUser = await this.userService.createAdmin(createAdmin, createAdminId,req);

    const{password,...result} = newUser.toObject();

    return {
      message: 'Admin created successfully. A verification link has been sent to the email.',
      user: result
    }
  }
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.ADMIN)
  @Get('recent')
  async getRecentUser(@Query('limit') limit:number = 5){
    return this.userService.getRecenUsers(limit);
  }

  @Get('role/:role')
  async getUsersByRole(@Param('role') role: UserRole) {
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new Error(`Invalid role: ${role}`);
    }

    return this.userService.findUsersByRole(role as UserRole);
  }
  @Get('user/:userId/enterprise')
  @UseGuards(AccessTokenGuards)
  @Roles(UserRole.ADMIN)
  async getEnterpriseByUser(@Param('userId') userId: string) {
    return this.userService.getUserEnterprise(userId);
  }
}
