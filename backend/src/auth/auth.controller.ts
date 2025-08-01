import { Controller, Post, Body, Res, Param, Req, BadRequestException, Query, HttpStatus, Get, NotFoundException, Put, UseInterceptors, UploadedFile, UseGuards, Delete, UnauthorizedException, InternalServerErrorException, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import { Request } from 'express';
import { Request as ExpressRequest } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { resetdto } from './dto/reset.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/entities/user.schema';
import { Connection, Model } from 'mongoose';
import { UserRole } from 'src/user/dto/create-user.dto';
import { Response} from 'express';
import { Roles } from 'src/guards/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateUserDto } from 'src/user/dto/update_user.dto';
import { AccessTokenGuards } from 'src/guards/accessToken.guards';
import { RefreshTokenGuards } from 'src/guards/refreshToken.guards';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
interface JwtPayloadWithRole {
  sub: string;
  email: string;
  role: UserRole;
}
interface RequestWithUser extends Request {
  user? : JwtPayloadWithRole;
}
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(User.name) private userModle: Model<UserDocument>,
                            private configService: ConfigService,
                            private userService: UserService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user } = await this.authService.login(dto,req);
    res.cookie('access_token', user.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refresh_token', user.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    const { accessToken, refreshToken, password, ...sanitizedUser } = user;

    return {
      message: 'Login successful',
      accessToken: user.accessToken,
      user: sanitizedUser,
    };
  }
  @UseGuards(AccessTokenGuards)
  @Post('logout')
  async logout(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.logout(req);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return result;
  }

  @UseGuards(RefreshTokenGuards)
  @Post('refresh-token')
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: RequestWithUser
  ) {
    const logger = new Logger('AuthController.refreshToken');
    logger.debug('Starting refresh token flow...');

    try {
      const user = req.user;

      logger.debug('Request received with user payload: ' + JSON.stringify(user));

      const userId = user?.sub;

      if (!user || !userId || !user.email || !user.role) {
        logger.warn('Missing user details in request — likely due to bad or missing refresh token');
        throw new UnauthorizedException('Invalid or missing user info in refresh token');
      }

      logger.debug(`Generating new tokens for user ID: ${userId}`);

      const tokens = await this.authService.getTokens(userId, user.email, user.role);

      if (!tokens || !tokens.refreshToken || !tokens.accessToken) {
        logger.error('Token generation failed — missing tokens');
        throw new InternalServerErrorException('Token generation failed');
      }

      logger.debug('Updating refresh token in DB...');
      await this.authService.updateRefreshToken(userId, tokens.refreshToken);

      logger.debug('Setting access_token cookie...');
      res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, 
      });

      logger.debug('Setting refresh_token cookie...');
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      logger.log(`Successfully refreshed tokens for user ID: ${userId}`);

      return {
        accessToken: tokens.accessToken,
      };

    } catch (error) {
      logger.error('Error in refreshToken():', error.stack || error.message);

      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An unexpected error occurred during token refresh');
    }
  }

  @UseGuards(AccessTokenGuards)
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Post('forget-password')
  async forgotPassword(
    @Body('email') email: string,
    @Req() req: ExpressRequest,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      if (!email) {
        throw new BadRequestException('Email is required');
      }

      const result = await this.authService.forgetPassword(email, req);

      return res.status(HttpStatus.OK).json({
        message: 'Reset password email sent successfully',
        data: result,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      const statusCode =
        error instanceof BadRequestException ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(statusCode).json({
        message: error.message || 'Something went wrong. Please try again later.',
        statusCode,
      });
    }
  }
  @UseGuards(AccessTokenGuards)
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Post('reset-password/:token')
  @ApiOperation({ summary: 'Reset user password using token from email' })
  async resetPassword(
    @Param('token') token: string,
    @Body() dto: resetdto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      if (!dto.password || dto.password.length < 6) {
        throw new BadRequestException('Password is required and must be at least 6 characters');
      }

      const result = await this.authService.resetPassword(token, dto.password);

      return res.status(HttpStatus.OK).json({
        message: 'Password has been reset successfully',
        data: result,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      const statusCode =
        error instanceof BadRequestException ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(statusCode).json({
        message: error.message || 'Password reset failed. Please try again later.',
        statusCode,
      });
    }
  }
  @Get('verify-email/:token')
  async verifyEmail(@Param('token') token: string, @Res() res: Response, @Req() req: Request ) {
    try{
      const origin=
      (req.headers['x-frontend-url'] as string) ||
      this.configService.get<string>('FRONTEND_URL')||
      `${req.protocol}://${req.get('host')}`;

      const result = await this.authService.verifyEmailToken(token);
      let statusParam = 'success';
      if(result.message === 'Email is already verified'){
        statusParam = 'already_verified';
      }

      return res.redirect(`${origin}/email-verified?status=${statusParam}`);
    }catch(error){
      const origin = 
      (req.headers['x-frontend-url'] as string) ||
      this.configService.get<string>('FRONTEND_URL') ||
      `${req.protocol}://${req.get('host')}`;
      console.error('Error verifying email token:', error.message);
      console.log('Received token:', token);

      return res.redirect(`${origin}/email-verified?status=error`);
    }
  }
@Get('users')
@Roles(UserRole.ADMIN)
async getAllUsers(@Res() response: Response ): Promise<Response>{
  try{
    const user = await this.userModle.find();
    return response.status(HttpStatus.OK).json({
      message: ' user Found Succesfully',
      users: user,
      statusCode: 200,
    })
  }catch(error){
    return response.status(HttpStatus.NOT_FOUND).json({
      message: 'no user Found',
      error: (error as Error).message,
      statusCode: 404,
    })
  }
}
@Put('update/:id')
@Roles(UserRole.ADMIN)
@UseGuards(AccessTokenGuards)
@UseInterceptors(
  FileInterceptor('image',{
    storage: diskStorage({
      destination: './uploads',
      filename: (req,file,cb) =>{
        cb(null, `${new Date().getTime()}-${file.originalname}`)
      },
    }),
  })
)
async updateProfile(@Res() response: Response, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File): Promise<Response> {
    try{
      if(file){
        updateUserDto.image = file?.filename;
      }
      const updateUser = await this.authService.updateProfile(id, updateUserDto);
      return response.status(HttpStatus.ACCEPTED).json({
        message: 'user updated successfully',
        updateUser,
        statusCode: 202,
      })
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something went wrong while trying to update you profile please try again later',
        error: (error as Error).message,
        statusCode: 400,
      });
    }
}

@Delete('delete/:id')
@UseGuards(AccessTokenGuards)
@Roles(UserRole.ADMIN)
async deleteAcount(@Res() response: Response, @Param('id') id:string): Promise<Response>{
  try{
    const deleteUser = await this.authService.deleteAccount(id);
    return response.status(HttpStatus.OK).json({
      message: 'user deleted successfully',
      deleteUser,
      statusCode: 200,
    });
  }catch(error){
    return response.status(HttpStatus.BAD_REQUEST).json({
      message: 'something went wrone while deleting user please try again later',
      error: (error as Error).message,
      statusCode: 400,
    });
  }
}

  @UseGuards(AccessTokenGuards)
  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    const logger = new Logger('UserController.getMe');

    try {
      logger.debug('Received request for /me');
      logger.debug('Request user object: ' + JSON.stringify(req.user));

      if (!req.user || !req.user.sub) {
        logger.warn('AccessToken guard passed but req.user is missing or malformed');
        throw new UnauthorizedException('User not authenticated or invalid token payload');
      }

      const userId = req.user.sub;
      logger.debug(`Extracted user ID from token: ${userId}`);
      const user = await this.userService.getMe(userId);

      if (!user) {
        logger.warn(`No user found with ID: ${userId}`);
        throw new UnauthorizedException('User not found or removed');
      }

      logger.log(`Successfully fetched user data for ID: ${userId}`);
      return user;

    } catch (error) {
      logger.error('Error in getMe(): ' + error.message, error.stack);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('An unexpected error occurred while fetching user data');
    }

  }

  @UseGuards(AccessTokenGuards)
  @Roles(UserRole.ADMIN)
  @Get('health')
  async checkHealth(){
    const isDbConnected = this.connection.readyState === 1;
    return{
      service: 'AuthService',
      status: 'ok',
      database: isDbConnected ? 'Connected' : 'Disconnected',
      timestamp: new Date().toString(),
    }
  }

}
