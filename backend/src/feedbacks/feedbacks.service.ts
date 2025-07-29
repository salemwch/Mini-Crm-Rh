import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Feedback } from './entities/feedback.entity';
import { PaginiationQueryDto } from 'src/common/dto/paginationQuery.dto';
@Injectable()
export class FeedbacksService {
  constructor(@InjectModel('Feedback') private feedbackModel: Model<Feedback>,
  @InjectModel('Contact') private contactModel: Model<Feedback>,  
){}
  async createFeedback(createFeedbackDto: CreateFeedbackDto, userId: string) {
    const { enterpriseId, ...rest } = createFeedbackDto;
    console.log("enterpriseId:", enterpriseId);
    const contact = await this.contactModel.findOne({
      enterpriseId: new Types.ObjectId(enterpriseId),
    });

    if (!contact) {
      throw new BadRequestException('No contact found for this enterprise. Feedback cannot be created without a contact.');
    }
    console.log(contact);
    const createdFeedback = await this.feedbackModel.create({
      ...rest,
      enterpriseId: new Types.ObjectId(enterpriseId),
      contactId: contact._id,
      user: new Types.ObjectId(userId),
    });

    if (!createdFeedback) {
      console.log("error", createdFeedback);
      throw new BadRequestException('Feedback not created');
    }

    return createdFeedback;
  }
  async findAll(): Promise<Feedback[]>{
    const findAllFeedBack = await this.feedbackModel.find();
    if(!findAllFeedBack || findAllFeedBack.length === 0){
      throw new BadRequestException('no feedback found ');
    }
    return findAllFeedBack;
  }
  async findOneFeedBAck(id: string): Promise<Feedback>{
    const feedback = await this.feedbackModel.findById(id);
    if(!feedback){
      throw new BadRequestException('feedback not found');
    }
    return feedback;
  }
  async findByEnterprise(enterpriseId: string): Promise<Feedback>{
    const findByEnterpriseId = await this.feedbackModel.findOne({enterpriseId});
    if(!findByEnterpriseId){
      throw new BadRequestException('feedback not found');
    }
    return findByEnterpriseId;
  }
  async updateFeedBack(id: string, updateFeedBackDto: UpdateFeedbackDto):Promise<Feedback>{
    const updateFeedBack = await this.feedbackModel.findByIdAndUpdate(id, updateFeedBackDto, {new: true});
    if(!updateFeedBack ) throw new BadRequestException('feedback not found');
    return updateFeedBack;
  }
  async remove(id: string): Promise<Feedback>{
    const deleted = await this.feedbackModel.findByIdAndDelete(id);
    if(!deleted) throw new BadRequestException('feedback not found');
    return deleted;
  }
  async GlobalFeedbacks(): Promise<number>{
    const globalFeedbacks = await this.feedbackModel.countDocuments();
    return globalFeedbacks;
  }
  async findAllFeedbacks(query: PaginiationQueryDto){
    const {page = '1', limit = '10', search, isActive} = query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const filter: any = {};
    if(search) filter.name = {$regex: search, $options: 'i'};
    if(isActive) filter.isActive = isActive === 'true';
    const [results, total] = await Promise.all([
      this.feedbackModel.find(filter)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
      this.feedbackModel.countDocuments(filter),
    ]);
    return {
      data: results,
      total,
      page: pageNum,
      limit: limitNum,
      totalpages: Math.ceil(total/limitNum),
    }
  }
  async getByEnterprise(enterpriseId: string) {
    return this.feedbackModel
      .find({ enterpriseId: new Types.ObjectId(enterpriseId), isActive: true })
      .populate('user', 'name email role image')
      .populate('contactId', 'name position email phone')
      .exec();
  }
  async getLastFiveFeedbacks(): Promise<Feedback[]> {
    return this.feedbackModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate([
        { path: 'enterpriseId', select: 'name' },
      ]).populate('user')
      .exec();
  }
  
}
