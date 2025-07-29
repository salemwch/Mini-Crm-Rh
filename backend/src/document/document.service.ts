import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Model } from 'mongoose';
import { DocumentEntity } from './entities/document.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Enterprise } from 'src/enterprise/entities/enterprise.entity';

@Injectable()
export class DocumentService {
  constructor(@InjectModel('Document') private documentModel: Model<DocumentEntity>,
              @InjectModel('Enterprise') private enterpriseModel: Model<Enterprise>,
){}

  async create(dto: CreateDocumentDto, fileUrl: string, userId: string): Promise<DocumentEntity> {
    const createdDoc = await this.documentModel.create({
      ...dto,
      url: fileUrl,
      enterpriseId: dto.enterpriseId,
      uploadedBy: userId,
    });

    await this.enterpriseModel.findByIdAndUpdate(dto.enterpriseId, {
      $push: { documents: createdDoc._id },
    });

    return createdDoc;
  }
  async findAll(): Promise<DocumentEntity[]>{
    const documents = await this.documentModel.find().populate("uploadedBy", "name").populate("enterpriseId", "name").exec();
    if(!documents || documents.length === 0){
      throw new BadRequestException('no documents found');
    }
    return documents;
  }
  async findByEnterprise(enterPriseId: string): Promise<DocumentEntity[]> {
    const documents = await this.documentModel.find({ enterpriseId: enterPriseId }).exec();
    if (!documents || documents.length === 0) {
      throw new BadRequestException('No documents found for this enterprise');
    }
    return documents;
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
  async searchByName(name: string): Promise<DocumentEntity[]> {
    if (!name) return [];
    const regex = new RegExp(name, 'i');

    return this.documentModel.find({ name: { $regex: regex } }).exec();
  }
}
