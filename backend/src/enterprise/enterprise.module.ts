import { forwardRef, Module } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EnterpriseSchema } from './entities/enterprise.entity';
import { UserModule } from 'src/user/user.module';
import { AuditLogModule } from 'src/AuditLogs/audit.module';
import { User, UserSchema } from 'src/user/entities/user.schema';
import { JobOfferModule } from 'src/joboffer/joboffer.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Enterprise', schema: EnterpriseSchema }, { name: User.name, schema: UserSchema },
]), AuditLogModule, forwardRef(() => UserModule ),
  forwardRef(() => JobOfferModule),
  forwardRef(() => EnterpriseModule),
],
  controllers: [EnterpriseController],
  providers: [EnterpriseService],
  exports:[EnterpriseService, MongooseModule],
})
export class EnterpriseModule {}
