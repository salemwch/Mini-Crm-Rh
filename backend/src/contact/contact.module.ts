import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactSchema } from './entities/contact.entity';
import { AuditLogModule } from 'src/AuditLogs/audit.module';
import { EnterpriseSchema } from 'src/enterprise/entities/enterprise.entity';

@Module({
  imports: [ MongooseModule.forFeature([{name: 'Contact', schema: ContactSchema},
                                        {name: 'Enterprise', schema: EnterpriseSchema}
  ]), AuditLogModule, ],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService]
})
export class ContactModule {}
