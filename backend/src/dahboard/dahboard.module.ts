import { Module } from '@nestjs/common';
import { DahboardService } from './dahboard.service';
import { DahboardController } from './dahboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/user.schema';
import { EnterpriseModule } from 'src/enterprise/enterprise.module';
import { ContactModule } from 'src/contact/contact.module';
import { FeedbacksModule } from 'src/feedbacks/feedbacks.module';
import { JobOfferModule } from 'src/joboffer/joboffer.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema}]), 
  EnterpriseModule,
  ContactModule,
  FeedbacksModule,
  JobOfferModule,
],
  controllers: [DahboardController],
  providers: [DahboardService],
  exports: [DahboardService]
})
export class DahboardModule {}
