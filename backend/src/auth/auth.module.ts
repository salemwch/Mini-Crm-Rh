import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessTokenStrategy } from './strategies/accessToken.staregie';
import { AuditLogModule } from 'src/AuditLogs/audit.module';
import { MailModule } from 'src/MailTrap/mail.module';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategie';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '20m'},
      })
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AuditLogModule ), 
    forwardRef(() => MailModule),
  ],
  controllers: [AuthController],
  providers: [AuthService,AccessTokenStrategy,RefreshTokenStrategy],
  exports: [AuthService]
})
export class AuthModule {}
