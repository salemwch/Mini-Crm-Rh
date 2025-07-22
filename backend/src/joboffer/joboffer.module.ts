import { forwardRef, Module } from '@nestjs/common';
import { JobOfferService } from './joboffer.service';
import { JobOfferController } from './joboffer.controller';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JobOfferSchema } from './entities/joboffer.entity';
import { EnterpriseModule } from 'src/enterprise/enterprise.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'JobOffer', schema: JobOfferSchema }]),
    forwardRef(() => UserModule),
    forwardRef(() => EnterpriseModule),
  ],
  controllers: [JobOfferController],
  providers: [JobOfferService],
  exports: [JobOfferService, MongooseModule],
})
export class JobOfferModule {}
