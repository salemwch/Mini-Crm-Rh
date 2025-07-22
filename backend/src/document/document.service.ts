import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Model } from 'mongoose';
import { DocumentEntity } from './entities/document.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DocumentService {
  constructor(@InjectModel('Document') private documentModel: Model<DocumentEntity>){}

  async create(dto: CreateDocumentDto, fileUrl: string, userId: string): Promise<DocumentEntity>{
    return this.documentModel.create({
      ...dto,
      url: fileUrl,
      enterpriseId: dto.enterPriseId,
      uploadedBy: userId,
    });
  }
  async findAll(): Promise<DocumentEntity[]>{
    const documents = await this.documentModel.find().exec();
    if(!documents || documents.length === 0){
      throw new BadRequestException('no documents found');
    }
    return documents;
  }
  async findByEnterprise(enterPriseId: string): Promise<DocumentEntity>{
    const findByEnterprise = await this.documentModel.findOne({enterpriseId: enterPriseId}).exec();
    if(!findByEnterprise){
      throw new BadRequestException('docment not found for this enterprise');
    }
    return findByEnterprise;
  }
  async remove(id: string): Promise<DocumentEntity>{
    const deleted = await this.documentModel.findByIdAndDelete(id);
    if(!deleted){
      throw new BadRequestException('document not found');
    }
    return deleted;
  }


  async findFeedback(feedbackId: string) :Promise<DocumentEntity[]>{
    const feedbackDocument = await this.documentModel.find({feedbackId, type: 'Feedback'}).exec();
    if(!feedbackDocument || feedbackDocument.length === 0){
      throw new BadRequestException('no documents found for this feedback');
    }
    return feedbackDocument;
  }

  async findByContacts(contactId: string): Promise<DocumentEntity>{
    const contactDocument = await this.documentModel.findOne({contactId, type: 'Contact'}).exec();
    if(!contactDocument){
      throw new BadRequestException('no  Document found for this contact ');
    }
    return contactDocument;
  }

  async findByJobOffer(jobOfferId: string): Promise<DocumentEntity[]>{
    const jobOfferDocument = await this.documentModel.find({jobOfferId, type: 'JobOffer'}).exec();
    if(!jobOfferDocument || jobOfferDocument.length === 0){
      throw new BadRequestException('no documents found for this job offer');
    }
    return jobOfferDocument;
  }

}
