import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MailService } from './mail.service';
import { getGmailAccessToken } from './google-auth';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        const accessToken = await getGmailAccessToken();
        return {
          transport: {
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: process.env.MAIL_USER,
              clientId: process.env.MAIL_CLIENT_ID,
              clientSecret: process.env.MAIL_CLIENT_SECRET,
              refreshToken: process.env.MAIL_REFRESH_TOKEN,
              accessToken: accessToken,
            },
            tls: {
              rejectUnauthorized: false,
            },
          },
          defaults: {
            from: `"Jobgate Mailer" <${process.env.MAIL_USER}>`,
          },
        };
      },
    }),
    JwtModule.register({}),
    AuthModule,
    UserModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule { }
