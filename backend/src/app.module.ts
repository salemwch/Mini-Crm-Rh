import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './MailTrap/mail.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './contact/contact.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { DocumentModule } from './document/document.module';
import { DahboardModule } from './dahboard/dahboard.module';
import { AbsenceModule } from './Absence/absence.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventModule } from './Events/event.Module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: '.env'
      }
    ),
    MongooseModule.forRoot(
      process.env.MONGO_URL || 'mongodb://localhost:27017/mini-crm-dbc',
      {
        autoIndex: process.env.NODE_ENV === 'development',
      }
    ),
    MailModule, AuthModule, UserModule, EnterpriseModule, ContactModule, FeedbacksModule, DocumentModule, DahboardModule,AbsenceModule,EventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
