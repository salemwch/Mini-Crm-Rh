import { forwardRef, Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackSchema } from './entities/feedback.entity';
import { ContactSchema } from 'src/contact/entities/contact.entity';
import { EnterpriseModule } from 'src/enterprise/enterprise.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Feedback', schema: FeedbackSchema},
                                      { name: 'Contact', schema: ContactSchema},
  ]), forwardRef(() => EnterpriseModule)],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
  exports: [FeedbacksService],
})
export class FeedbacksModule {}
