import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobOfferDto } from './dto/createjoboffer.dto';
import { UpdateJobOfferDto } from './dto/updatejoboffer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { IJobOffer } from './interface/InterfaceJobOffer';
import { JobOffer } from './entities/joboffer.entity';
import { Enterprise } from 'src/enterprise/entities/enterprise.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class JobOfferService {
  constructor(
    @InjectModel('JobOffer') private jobOfferModel: Model<JobOffer>,
    @InjectModel('Enterprise') private enterpriseModel: Model<Enterprise>
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateExpiredJobOffers(){
    const now = new Date();
    const result = await this.jobOfferModel.updateMany(
      {expiryDate: {$lt: now}, status: {$ne: 'expired'}},
      {$set: {status: 'expired'}}
    );
    console.log(`[Cron] Job Offers expired updated: ${result.modifiedCount}`);
  }
  async create(dto: CreateJobOfferDto, userId: string): Promise<HydratedDocument<JobOffer>> {
    if (!Types.ObjectId.isValid(dto.enterpriseId)) {
      throw new BadRequestException('Invalid enterpriseId format.');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId format.');
    }
    const enterprise = await this.enterpriseModel.findOne({
      _id: new Types.ObjectId(dto.enterpriseId),
      addBy: { $in: [new Types.ObjectId(userId)] },
    });
    if (!enterprise) {
      throw new ForbiddenException('You do not have permission to create a job offer for this enterprise.');
    }
    const newOffer = new this.jobOfferModel({
      ...dto,
      enterpriseId: new Types.ObjectId(dto.enterpriseId),
      addBy: new Types.ObjectId(userId),
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
    });
    return newOffer.save();
  }
  async update(id: string, updateDto: UpdateJobOfferDto): Promise<HydratedDocument<JobOffer>> {
    const updated = await this.jobOfferModel.findByIdAndUpdate(id,updateDto, { new: true});
    if(!updated){
      throw new BadRequestException('job offer not found');
    }
    return updated;
  }
  async delete(id: string): Promise<void> {
    const result = await this.jobOfferModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Job offer with id ${id} not found`);
    }
  }
  async getById(id: string): Promise<HydratedDocument<JobOffer>> {
    const jobOffer = await this.jobOfferModel.findById(id);
    if (!jobOffer) {
      throw new NotFoundException(`Job offer with id ${id} not found`);
    }
    return jobOffer;
  }
  async getAll(filter: any = {}, page = 1, limit = 10): Promise<HydratedDocument<JobOffer>[]> {
    const skip = (page - 1) * limit;
    return this.jobOfferModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
  }
  async incrementViewCount(id: string): Promise<void> {
    const updated = await this.jobOfferModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    if (!updated) {
      throw new NotFoundException(`Job offer with id ${id} not found`);
    }
  }
  async getActiveOffers(): Promise<HydratedDocument<JobOffer>[]> {
    return this.jobOfferModel.find({ expiryDate: { $gt: new Date() } }).exec();
  }
  async getExpiredOffers(): Promise<HydratedDocument<JobOffer>[]> {
    return this.jobOfferModel.find({ expiryDate: { $lte: new Date() } }).exec();
  }

  async getStatistics(): Promise<{ total: number; active: number; expired: number }> {
    const now = new Date();
    const [total, active, expired] = await Promise.all([
      this.jobOfferModel.countDocuments(),
      this.jobOfferModel.countDocuments({ expiryDate: { $gt: now } }),
      this.jobOfferModel.countDocuments({ expiryDate: { $lte: now } }),
    ]);
    return { total, active, expired };
  }
  async searchOffers(query: string, filters: any, page = 1, limit = 10): Promise<HydratedDocument<JobOffer>[]> {
    const skip = (page - 1) * limit;
    const searchFilter = {
      ...filters,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { requirements: { $regex: query, $options: 'i' } },
      ],
    };
    return this.jobOfferModel.find(searchFilter).skip(skip).limit(limit).exec();
  }
  async getJobOffersByEnterprise(enterpriseId: string): Promise<JobOffer[]> {
    if (!enterpriseId) {
      throw new BadRequestException('Enterprise ID is required');
    }
    const enterpriseObjectId = new Types.ObjectId(enterpriseId);

    const offer =  this.jobOfferModel.find({ enterpriseId: enterpriseObjectId }).populate('enterpriseId').exec();
    return offer;
  }

  async getLastFiveJobOffers(): Promise<JobOffer[]> {
    return this.jobOfferModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate([
        { path: 'addBy', select: 'name email' },
        { path: 'enterpriseId', select: 'name' },
      ])
      .exec();
  }
}
