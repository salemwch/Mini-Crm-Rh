import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/Login.dto';
import * as argon2 from 'argon2';
import { UserRole } from 'src/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForgetPasswordsuccess } from './PasswordResponse/ForgetPasswordsuccess';
import { MailService } from 'src/MailTrap/mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Request } from 'express';
import { AuditLogService } from 'src/AuditLogs/audit.service';
import { ResetPasswordSuccessResponse } from './PasswordResponse/resetPasswordScuccesResponse';
import { DeleteAccountSuccessResponse } from './deleteAccountResponse/deleteAccountSuccessResponse';
import { User } from 'src/user/entities/user.schema';
import { IUser } from 'src/user/interface/interface';
import { UpdateUserDto } from 'src/user/dto/update_user.dto';
import { Types } from 'mongoose';

interface JwtPayloadWithRole {
  sub: string;
  email: string;
  role: UserRole;
}
interface RequestWithUser extends Request {
  user? : JwtPayloadWithRole;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailerService,
    private readonly auditLogService: AuditLogService,
    private readonly mailService2: MailService
  ) {}
  async login(dto: LoginDto, req: Request) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user.isEmailVerified) {
      await this.mailService2.sendVerificationEmail(user,req);

      throw new UnauthorizedException('Email not verified. Verification email resent, please check your inbox.');
    }
    if (!user.isApproved) {
      throw new UnauthorizedException(
        'Your account is pending admin approval. Please wait for confirmation.'
      );
    }
    
    if (!user.isActive) {
      throw new UnauthorizedException('you are banned for some reasons you contact the support team for more details');
    }
    const isValid = await argon2.verify(user.password, dto.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const userId = user._id.toString();
    const tokens = await this.getTokens(userId, user.email, user.role);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    await this.userService.updateLastSeen(userId);
    await this.auditLogService.createLog({
      userId: new Types.ObjectId(userId),
      action: 'LOGIN',
      description: `User ${user.email} logged in`
    })

    const userJson = user.toObject();
    const userWithTokens = {
      ...userJson,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
    return {
      user: userWithTokens,
    };
  }
  hashData(data: string): Promise<string> {
    return argon2.hash(data);
  }
  async updateRefreshToken(userID: any, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userID, {
      refreshToken: hashedRefreshToken,
    });
  }
  
  async getTokens(userId: string, email: string, role: UserRole) {
    const refreshToken = await this.jwtService.signAsync(
      
      {sub: userId, email, role},
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        
        expiresIn: '7d',
      }
      
    );
    const accessToken = await this.jwtService.signAsync(
      {sub: userId, email, role},
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '20m',
      }
    );
    return{accessToken, refreshToken};
    
  }
  async logout(req: RequestWithUser): Promise<{ message: string; statusCode: number }> {
    try {
      const id = req.user?.sub;

      if (!id) {
        return {
          message: 'Unauthorized: No user ID found in token',
          statusCode: 401,
        };
      }

      const result = await this.userService.update(id, { refreshToken: null });

      if (!result) {
        console.warn(`[LOGOUT] No user found with ID: ${id}`);
        return {
          message: 'User not found or already logged out.',
          statusCode: 404,
        };
      }

      await this.auditLogService.createLog({
        userId: new Types.ObjectId(id),
        action: 'LOGOUT',
        description: `User with id ${id} logged out successfully`,
      });

      console.log(`[LOGOUT] Successfully logged out user with ID: ${id}`);

      return {
        message: 'Logout successful. Refresh token cleared.',
        statusCode: 200,
      };
    } catch (error) {
      console.error(`[LOGOUT ERROR] Failed to log out user:`, error);
      throw new Error('Logout failed due to a server error.');
    }
  }
  async forgetPassword(
    email: string,
    req: Request,
  ): Promise<ForgetPasswordsuccess> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const accessToken = this.jwtService.sign(
      { _id: user._id },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '20m',
      },
    );

    await this.userService.updatetoken(user._id, accessToken);

    const origin =
      (req.headers['x-frontend-url'] as string) ||
      `${req.protocol}://${req.get('host')}`;

    const resetLink = `${origin}/auth/reset-password/${accessToken}`;

    const mailOptions = {
      to: user.email,
      subject: 'Reset Your Password',
      html: `
        <p>Hello ${user.name || "User"},</p>
        <p>You requested to reset your password. Click the button below:</p>
        <a href="${resetLink}" style="
          display: inline-block;
          padding: 12px 24px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
        ">Reset Your Password</a>
        <p style="margin-top:20px;">If you did not request this, just ignore this email.</p>
        <p><strong>Note:</strong> This link expires in 20 minutes.</p>
      `
    };

    await this.mailService.sendMail(mailOptions);

    return {
      success: true,
      message: 'A reset link has been sent to your email',
    };
  }
  async resetPassword(token: string, newPassword: string):Promise<ResetPasswordSuccessResponse>{
    try{
      const decoded = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      const user = await this.userService.findById(decoded._id);
      if(!user){
        throw new BadRequestException('user not found ');
      }
      await this.userService.updatePassword(user._id.toString(),newPassword);
      return {
        success: true,
        message: 'password reset successfully',
      };
    }catch(error){
      throw new BadRequestException('invalid or expired token');
    }
  }

  async deleteAccount(id: string): Promise<DeleteAccountSuccessResponse>{
    const user = await this.userService.findById(id);
    if(!user)  {
      throw new BadRequestException({
        success: false,
        message: 'user Does not exist'
      } );
    }
    const deleteUser =  await this.userService.deleteAccount(id);
    if(!deleteUser){
      throw new BadGatewayException({
        success: false,
        message: 'something went wrong while deleting user',
      })
    }
    await this.auditLogService.createLog({
      userId: new Types.ObjectId(id),
      action: 'Account_deleted',
      description: `User ${user.email} (role: ${user.role} delted their account)`,
    })
    return {
      success: true,
      message: 'user deleted successfully',
    }

  }
  
  async verifyEmailToken(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const decoded = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_VERIFICATION_SECRET'),
      });
      const user = await this.userService.findById(decoded.sub);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.isEmailVerified) {
        return {
          success: true,
          message: 'Email is already verified',
        };
      }

      await this.userService.verifyEmail(user._id.toString());      

      return {
        success: true,
        message: 'Email verified successfully ',
      };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
  async getallUsers(): Promise<IUser[]> {
    const user = await this.userService.findAll();
    if(!user) throw new NotFoundException('no user found');
    return user;
  }
  async updateProfile(id: string, updateduserdto: UpdateUserDto): Promise<IUser>{
    const updateuser = await this.userService.update(id, updateduserdto);
    if(!updateuser) throw new NotFoundException(` User won't update check your id `);
    await this.auditLogService.createLog({
      userId: new Types.ObjectId(id),
      action: 'Profile_Update',
      description: `User with id ${id} update their profile`,
    })
    return updateuser;
  }
}