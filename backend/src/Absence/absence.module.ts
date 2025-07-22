import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbsenceSchema } from './entities/absence.entitie';
import { UserModule } from '../user/user.module';
import { AbsenceService } from './serviceAbsence';
import { AbsenceController } from './controllerAbsence';
import { Absence } from './entities/absence.entitie';
import { NotificationModule } from './notification/notification.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Absence.name, schema: AbsenceSchema }]),
        NotificationModule,
        UserModule,
    ],
    controllers: [AbsenceController],
    providers: [AbsenceService],
    exports: [AbsenceService],
})
export class AbsenceModule { }
