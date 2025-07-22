import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Enterprise } from './entities/enterprise.entity';
import { PaginiationQueryDto } from 'src/common/dto/paginationQuery.dto';
import { AuditLogService } from 'src/AuditLogs/audit.service';
import { User } from 'src/user/entities/user.schema';
import { UserRole } from 'src/user/dto/create-user.dto';
interface JwtPayloadWithRole {
  sub: string;
  email: string;
  role: UserRole;
}
interface RequestWithUser extends Request {
  user?: JwtPayloadWithRole;
}
@Injectable()
export class EnterpriseService {
  constructor(
    @InjectModel('Enterprise') private enterpriseModel: Model<Enterprise>,
    @InjectModel(User.name) private userModel: Model<User>,
                            private readonly auditLogService: AuditLogService,
  ){}

  async create(createEnterpriseDto: CreateEnterpriseDto, userId: string): Promise<Enterprise>{
    const {name, website,phone} = createEnterpriseDto;

    const existtingEnterprise = await this.enterpriseModel.findOne({
      $or: [
        {name: name.trim()},
        {website: website.trim()},
        {phone: phone?.trim()},
      ]
    });
    if(existtingEnterprise){
      throw new BadRequestException('an Enterprise  with the same name website  or phone already exist ')
    }
    const enterprise = new this.enterpriseModel({
      ...createEnterpriseDto,
      addBy: new Types.ObjectId(userId),
      isApproved: false,
    });
    const user = await this.userModel.findById(userId).select('name role')
    await this.auditLogService.createLog({
      userId: new Types.ObjectId(userId),
      action: 'Enterprise_Created',
      description: `enterprise ${enterprise.name} created by ${user?.role} ${user?.name || userId}`
    })
    return enterprise.save();
  }
  async findAll(): Promise<Enterprise[]>{
    const findAllEnterprise = await this.enterpriseModel.find();
    if(!findAllEnterprise || findAllEnterprise.length === 0){
      throw new NotFoundException('no enterprise founded');
    }
    return findAllEnterprise;
  }
  async findOneEnterprise(id: string): Promise<Enterprise>{
    const findEnterprise = await this.enterpriseModel.findById(id).select('name website phone secteur address rating notes addBy isActive industryCode contacts documents isApproved createdAt updatedAt');
    if(!findEnterprise){
      throw new NotFoundException(`Enterprise with id ${id} not found`);
    }
    return findEnterprise;
  }
  async updateEnterPrise(id: string, updateEnterpriseDto : UpdateEnterpriseDto): Promise<Enterprise>{
    const updateEnterprise = await this.enterpriseModel.findByIdAndUpdate(id, updateEnterpriseDto, {new: true});
    if(!updateEnterprise) throw new NotFoundException(` enterprise with id ${id} not found `);
    return updateEnterprise;
  }
  async removeEnterprise(id: string): Promise<Enterprise>{
    const removeOneEnterprise = await this.enterpriseModel.findByIdAndDelete(id);
    if(!removeOneEnterprise) throw new BadRequestException(` enterprise with ${id} won't deleted`);
    return removeOneEnterprise;
  }

  async getTotalEnterpirses(): Promise<number>{
    return this.enterpriseModel.countDocuments();
  }
  async findAllEnterprise(query: PaginiationQueryDto, req: RequestWithUser) {
    const { page = '1', limit = '10', search, sector, isActive, isApproved } = query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const filter: any = {};

    if (search) filter.name = { $regex: search, $options: 'i' };
    if (sector) filter.secteur = sector;
    if (isActive) filter.isActive = isActive === 'true';

    const currentUser = req.user;

    if (currentUser?.role === UserRole.ADMIN) {
      if (isApproved !== undefined) {
        filter.isApproved = isApproved === 'true';
      }
    } else {
      filter.isApproved = true;
    }

    const [results, total] = await Promise.all([
      this.enterpriseModel.find(filter)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      this.enterpriseModel.countDocuments(filter),
    ]);

    return {
      data: results,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }



  async getEnterpriseCountBySector() {
    return this.enterpriseModel.aggregate([
      {$group: {_id: "$secteur", count: {$sum: 1}}},
      {$sort: {count: -1}},
    ])
  }
  async getRecentEnterprises(limit = 5) {
    return this.enterpriseModel.find().sort({ createdAt: -1 }).limit(limit);
  }
  async countInactiveEnterprises() {
    return this.enterpriseModel.countDocuments({ isActive: false });
  }

  async getAverageEnterpriseRating(){
    const result = await this.enterpriseModel.aggregate([
      {$match: {rating: {$exists: true}}},
      {$group: {_id: null, avgRating: {$avg: "$rating"}}},
    ]);
    return result[0]?.avgRating || 0;
  }
  async approveEnterprise(id: string) {
    const enterprise = await this.enterpriseModel.findById(id);
    if (!enterprise) throw new NotFoundException('Enterprise not found');

    enterprise.isApproved = true;
    return enterprise.save();
  }
  async approvedEnterprise(id: string) {
    return this.enterpriseModel.findByIdAndUpdate(id, { isApproved: true }, { new: true });
  }
  async getEnterprisesByUser(userId: string): Promise<Enterprise[]> {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    const userObjectId = new Types.ObjectId(userId);
    return this.enterpriseModel.find({ addBy: userObjectId }).exec();
  }

}
