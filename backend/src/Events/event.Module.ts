import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './entities/event.entities';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { NotificationModule } from 'src/Absence/notification/notification.module';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
    NotificationModule],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService],
})
export class EventModule { }
