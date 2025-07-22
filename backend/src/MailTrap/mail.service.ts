import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/user/entities/user.schema';
import { Request } from 'express';
import { subtle } from 'crypto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}
  async sendUserConfirmation(
    name: string,
    email: string,
    subject: string,
    message: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: 'salemwachwacha1997@gmail.com',
        from: 'contact From <noreply@Crm.com>',
        subject: subject,
        text: `From : ${name} <${email}>\n\n${message}`,
        html: `<b>From : </b> ${name} &lt;${email}&gt;<br><p>${message}</p>`,
      });
      return { message: 'email sent successfully' };
    } catch (error) {
      return { message: `failed to send email  ${(error as Error).message}` };
    }
  }
  async sendVerificationEmail(user: UserDocument, req: Request): Promise<void> {
    const payload = { email: user.email, sub: user._id.toString() };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_VERIFICATION_SECRET'),
      expiresIn: '10m',
    });
    console.log('[SEND] Verification Secret:', this.configService.get<string>('JWT_VERIFICATION_SECRET'));

    const origin =
      (req.headers['x-frontend-url'] as string) ||
      `${req.protocol}://${req.get('host')}`;

    const verificationURL = `${origin}/auth/verify-email/${token}`;

    const mailOptions = {
      to: user.email,
      subject: 'Verify your email address',
      html: `
        <p>Thank you for registering! Please verify your email address by clicking the link below:</p>
        <a href="${verificationURL}">${verificationURL}</a><br><br>
        <b>Note:</b> This link expires in 10 minutes.`,
    };

    await this.mailerService.sendMail(mailOptions);
  }
  
  
  
  
  
}
