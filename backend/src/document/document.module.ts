import { forwardRef, Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema } from './entities/document.entity';
import { EnterpriseModule } from 'src/enterprise/enterprise.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Document', schema: DocumentSchema }]), forwardRef(() => EnterpriseModule)
],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService]
})
export class DocumentModule {}
