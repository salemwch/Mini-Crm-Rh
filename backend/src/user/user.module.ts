import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';
import { EnterpriseModule } from 'src/enterprise/enterprise.module';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/MailTrap/mail.module';
import { ContactModule } from 'src/contact/contact.module';
import { FeedbacksModule } from 'src/feedbacks/feedbacks.module';
import { AuditLogModule } from 'src/AuditLogs/audit.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EnterpriseModule,
    forwardRef(()=> AuthModule),
    forwardRef(()=> MailModule),
    ContactModule,
    FeedbacksModule,
    forwardRef(() => AuditLogModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
