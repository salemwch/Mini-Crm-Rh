import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { isValidObjectId, Model, Types } from 'mongoose';
import { User, UserDocument } from './entities/user.schema';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { IUser } from './interface/interface';
import { UpdateUserDto } from './dto/update_user.dto';
import { UpdateUserRole } from './dto/updateUserRole';
import { EnterpriseService } from 'src/enterprise/enterprise.service';
import { MailService } from 'src/MailTrap/mail.service';
import { Request } from 'express';
import { ContactService } from 'src/contact/contact.service';
import { FeedbacksService } from 'src/feedbacks/feedbacks.service';
import { AuditLogService } from 'src/AuditLogs/audit.service';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<IUser>,
              private readonly auditLogService: AuditLogService,
              private readonly mailService: MailService,
) {}
  async create(createUserDto: CreateUserDto, req: Request): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
    if (existingUser) {
      throw new ConflictException(`User with email ${existingUser.email} already exists`);
    }

    const adminExist = await this.userModel.exists({ role: UserRole.ADMIN });
    const assignedRole = adminExist ? UserRole.RH : UserRole.ADMIN;

    const hash = await this.hashdata(createUserDto.password);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hash,
      role: assignedRole,
      isApproved: assignedRole === UserRole.ADMIN ? true : false,
      isEmailVerified: false,
    });

    const savedUser = await newUser.save();

    await this.mailService.sendVerificationEmail(savedUser, req);

    await this.auditLogService.createLog({
      userId: new Types.ObjectId(savedUser._id),
      action: 'User_registered',
      description: `New ${savedUser.role} account created with email ${savedUser.email}`,
    });

    return savedUser;
  }

  hashdata(data: string) {
    return argon2.hash(data);
  }
  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: email }).exec();
    
    if(!user){
      throw new BadRequestException(`user with  email : ${email} not found`)
    };
    
    return user;
  }
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }
  
  async update(
    id: string,
    updateduserdto: UpdateUserDto,
  ): Promise<IUser | null> {
    if (updateduserdto.password) {
      updateduserdto.password = await argon2.hash(updateduserdto.password);
    }
    return this.userModel.findByIdAndUpdate(id, updateduserdto, { new: true });
  }
  
  async updatetoken(id: any, token: string): Promise<IUser | null> {
    return this.userModel.findByIdAndUpdate(id, { token }, { new: true });
  }

  async deleteAccount(id: string): Promise<IUser> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid user ID format');
      }

      const deletedUser = await this.userModel.findByIdAndDelete(id);

      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }

      return deletedUser;
    } catch (error) {
      if (error instanceof BadRequestException|| error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Something went wrong while deleting the user');
    }
  }
  async updateStatus(id: string, isActive: boolean): Promise<User>{
    const user = await this.userModel.findByIdAndUpdate(id,  {isActive}, {new: true});
    if(!user) throw new NotFoundException('user not found');
    return user;
  }
  async updateLastSeen(id: string): Promise<User| null> {
    const Seen = await this.userModel.findByIdAndUpdate(id, { lastSeen: new Date() });
    return Seen;
  }
  async updateUserRole(id: string, updateUserRole: UpdateUserRole): Promise<User>{
    const  user  = await this.userModel.findById(id);
    if(!user){
      throw new NotFoundException(`User with Id ${id} not found`);
    }
    user.role = updateUserRole.role;
    return await user.save();
  }
  async findAll(): Promise <IUser[]>{
    try{
      const user  = await this.userModel.find().exec();
      if(!user || user.length === 0){
        throw new NotFoundException('no user found');
      }
      return user;
    }catch(error){
      throw new InternalServerErrorException('failed  to retive users');
    }
  }

  async updatePassword(userId: string, newPassword: string):Promise<void>{
    const hashedPassword = await this.hashdata(newPassword);
    await this.userModel.findByIdAndUpdate(userId, {password:hashedPassword , refreshToken: null}, );
  }
  async verifyEmail(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      isEmailVerified: true,
    });
  }
  async getAllUsers(): Promise<IUser[]>{
    const users = await this.userModel.find();
    if(!users || users.length === 0){
      throw new NotFoundException('no user found');
    }
    return users 
  }

  async approvedUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isApproved = true;
    await user.save();

    return user;
  }
  

  async isAdminExist(): Promise<boolean>{
    const admin = await this.userModel.exists({role: UserRole.ADMIN});
    return  !!admin;
  }
  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).select('email role name image createdAt updatedAt isActive isEmailVerified isApproved').lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
      isApproved: user.isApproved,
      isEmailVerified: user.isEmailVerified,
    };
  }
  async getAllUsersFiltered(filters: {
    page: number;
    limit: number;
    search?: string;
    isActive?: boolean;
    isApproved?: boolean;
    isEmailVerified?: boolean;
  }) {
    const { page, limit, search, isActive, isApproved, isEmailVerified } = filters;

    const query: any = {};

    if (typeof isActive === 'boolean') query.isActive = isActive;
    if (typeof isApproved === 'boolean') query.isApproved = isApproved;
    if (typeof isEmailVerified === 'boolean') query.isEmailVerified = isEmailVerified;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel.find(query).skip(skip).limit(limit),
      this.userModel.countDocuments(query),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      users,
    };
  }
    async createAdmin(createUserDto : CreateUserDto, createAdminId: string, req: Request): Promise<UserDocument>{
      const existingUser = await this.userModel.findOne({email : createUserDto.email}).exec();
      if(existingUser){
        throw new ConflictException(`User with email ${createUserDto.email} already exist`);
      }
      const creator = await this.userModel.findById(createAdminId).exec();
      if(!creator || creator.role !== UserRole.ADMIN){
        throw new BadRequestException(`only ad administrator can create new admin accounts`);
      }
      const hash = await this.hashdata(createUserDto.password);

      const newUSers = new this.userModel({
        ...createUserDto,
        password: hash,
        role: UserRole.ADMIN,
        isApproved: true,
        isEmailVerified: false,
      })
      const savedUser = await newUSers.save();
      
      await this.mailService.sendVerificationEmail(savedUser,req);
      await this.auditLogService.createLog({
        userId: new Types.ObjectId(createAdminId),
        action: 'User-registered',
        description: `New Admin account Created for ${savedUser.email} by admin id ${createAdminId}`
      });

      return savedUser;


    }
    
    async getRecenUsers(limit: number){
      return this.userModel.find({}, {name: 1, email:1, status:1 ,createdAt: 1}).sort({createdAt: -1}).limit(limit);
    }
}
