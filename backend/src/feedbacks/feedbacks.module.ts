import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackSchema } from './entities/feedback.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Feedback', schema: FeedbackSchema}])],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
  exports: [FeedbacksService],
})
export class FeedbacksModule {}
