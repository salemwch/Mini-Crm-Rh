import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Contact } from './entities/contact.entity';
import { PaginiationQueryDto } from 'src/common/dto/paginationQuery.dto';
import { AuditLogService } from 'src/AuditLogs/audit.service';
import { Enterprise } from 'src/enterprise/entities/enterprise.entity';
import { types } from 'util';
import { UserRole } from 'src/user/dto/create-user.dto';



@Injectable()
export class ContactService {
  constructor(@InjectModel("Contact") private contactModel: Model<Contact>,
  @InjectModel("Enterprise") private enterpriseModel: Model<Enterprise>,
                                      private auditLogService: AuditLogService,
){}

  async create(createContactDto: CreateContactDto, addBy: string, userRole: UserRole): Promise<Contact> {
    const enterpriseId = createContactDto.enterpriseId;

    const enterprise = await this.enterpriseModel.findById(enterpriseId).select('addBy contacts') as Enterprise & Document;

    if (!enterprise) {
      throw new NotFoundException('Enterprise not found');
    }
    const isAuthorized = userRole === UserRole.ADMIN || enterprise.addBy.some(
      (userId) => userId.toString() === addBy
    );

    if (!isAuthorized) {
      throw new ForbiddenException('You are not allowed to create a contact for this enterprise');
    }

    const createdContact = new this.contactModel({
      ...createContactDto,
      enterpriseId: new Types.ObjectId(enterpriseId),
      addBy: new Types.ObjectId(addBy),
    });

    await createdContact.save();
    if (!enterprise.contacts) {
      enterprise.contacts = [];
    }

    enterprise.contacts.push(createdContact._id);
    await this.enterpriseModel.updateOne(
      { _id: enterpriseId },
      { $push: { contacts: createdContact._id } }
    );

    await this.auditLogService.createLog({
      userId: new Types.ObjectId(addBy),
      action: 'Contact_Created',
      description: `Contact ${createdContact._id} created by user ${addBy}`,
    });

    return createdContact;
  }
  async findAll(): Promise<Contact[]>{
    const findAllContact = await this.contactModel.find();
    if(!findAllContact || findAllContact.length === 0){
      throw new NotFoundException('not contact found');
    }
    return findAllContact;
  }

  async findOneContact(id: string): Promise<Contact>{
    const findContactById = await this.contactModel.findById(id).exec();
    if(!findContactById){
      throw new NotFoundException(` contact with id ${id} not found`);
    }
    return findContactById
  }

  async findEnterprise(enterpriseId: string): Promise<Contact[]>{
    const objectId = new Types.ObjectId(enterpriseId);

    const findEnterpriseById = await this.contactModel.find({ enterpriseId: objectId }).populate('enterpriseId').populate('addBy', 'name email phone position preferedContactMethod').exec();
    if(!findEnterpriseById) throw new NotFoundException('enterprise not found')
  return findEnterpriseById;
    }

  async updateContact(id: string, dto: UpdateContactDto, userId: string): Promise<Contact> {
    const updatedContact = await this.contactModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updatedContact) throw new BadRequestException('Contact not found');
    await this.auditLogService.createLog({
      userId: new Types.ObjectId(userId),
      action: 'CONTACT_UPDATED',
      description: `Contact ${id} updated by user ${userId}`,
    });
    return updatedContact;
  }
    
  async removeContact(id: string, userId: string): Promise<Contact>{
      const removeContact = await this.contactModel.findByIdAndDelete(id);
      if(!removeContact) throw new BadRequestException('contact not found');
      await this.auditLogService.createLog({
        userId: new Types.ObjectId(userId),
        action:'Contact_deleted',
        description: ` contact ${id} delted by user ${userId}`,
      })
      return removeContact;
        }
  async getGlobalContact(): Promise<number>{
      const globalContact = await this.contactModel.countDocuments();
      return globalContact;
  }

  async findAllcontacts(query: PaginiationQueryDto){
      const {page= '1', limit = '10', search,isActive} = query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      const filter: any = {}; 
      if(search) filter.name = {$regex: search, $options: 'i'}
      if(isActive) filter.isActive = isActive === 'true';



      const [results, total] = await Promise.all([
        this.contactModel.find(filter)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
        this.contactModel.countDocuments(filter),
      ]);



      return {
        data: results,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      };
    }
  async getContactsByUser(userId: string) {
    return this.contactModel.find({ enterpriseId: userId }).exec();
  }
  async getContactById(contactId: string): Promise<Contact | null> {
    return this.contactModel
      .findById(contactId)
      .populate('enterpriseId')
      .populate('addBy', 'name email')
      .exec();
  }
  async searchContacts(filters: {
    name?: string;
    email?: string;
    position?: string;
    preferedContactMethod?: string;
  }): Promise<Contact[]> {
    const query: any = {};

    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }
    if (filters.email) {
      query.email = { $regex: filters.email, $options: 'i' };
    }
    if (filters.position) {
      query.position = { $regex: filters.position, $options: 'i' };
    }
    if (filters.preferedContactMethod) {
      query.preferedContactMethod = filters.preferedContactMethod;
    }
    console.log('Search query:', query);

    return this.contactModel.find(query).exec();
  }
}
