import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback } from './entities/feedback.entity';
import { PaginiationQueryDto } from 'src/common/dto/paginationQuery.dto';

@Injectable()
export class FeedbacksService {
  constructor(@InjectModel('Feedback') private feedbackModel: Model<Feedback>){}

  async createFeedback(createFeedbackDto: CreateFeedbackDto): Promise<Feedback>{
    const createdFeedBack = await this.feedbackModel.create(createFeedbackDto);
    if(!createdFeedBack){
      throw new BadRequestException('feedback not created');
    }
    return createdFeedBack;
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

}
