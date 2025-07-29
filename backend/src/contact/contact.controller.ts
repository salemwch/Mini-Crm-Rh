import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, HttpStatus, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Roles } from 'src/guards/role.decorator';
import { UserRole } from 'src/user/dto/create-user.dto';
import { Response, response } from 'express';
import { AccessTokenGuards } from 'src/guards/accessToken.guards';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginiationQueryDto } from 'src/common/dto/paginationQuery.dto';
import { RoleGuard } from 'src/guards/role.guards';
import { Logger } from '@nestjs/common';
interface JwtPayloadWithRole {
  sub: string;
  email: string;
  role: UserRole;
}
interface RequestWithUser extends Request {
  user?: JwtPayloadWithRole;
}
@Controller('contact')
export class ContactController {
  private readonly logger = new Logger(ContactController.name);
  constructor(private readonly contactService: ContactService) {}
  @UseGuards(AccessTokenGuards)
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Post()
  async createContact(@Res() response: Response, @Body() createContactDto: CreateContactDto, @Req() req: RequestWithUser): Promise<Response>{
    console.log('req.user:', req.user);
    if(!req.user){
      throw new BadRequestException('user not found');
    }
    try{
      const createdContact = await this.contactService.create(createContactDto, req.user.sub, req.user.role);
      console.log('req.user.sub:', req.user.sub);

      console.log(" createdContact",createdContact);
      return response.status(HttpStatus.CREATED).json({
        message: 'contact created successfully',
        createdContact,
        statusCode: 201,
      });
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something went wrong when creating contact please try again later',
        error: (error as Error).message,
        statusCode: 400,
      });
    }
  }
  @UseGuards(AccessTokenGuards)
  @Get('enterprise/:enterpriseId')
  @Roles(UserRole.ADMIN, UserRole.RH)
  async findEnterpriseById(
    @Res() response: Response,
    @Param('enterpriseId') enterpriseId: string
  ): Promise<Response> {
    try {
      this.logger.log(`fetching enterprise with ID: ${enterpriseId}`)
      const enterprise = await this.contactService.findEnterprise(enterpriseId);
      return response.status(HttpStatus.OK).json({
        message: 'Enterprise found successfully',
        data: enterprise,
        statusCode: 200,
      });
    } catch (error) {
      this.logger.error(`error fetching enterprise with ID: ${enterpriseId}, error: ${error.message}, stack: ${error.stack}, status code: ${HttpStatus.BAD_REQUEST}, `);
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Something went wrong when fetching enterprise. Please try again later.',
        error: (error as Error).message,
        statusCode: 400,
      });
    }
  }
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Get('/search')
  async searchContacts(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('position') position?: string,
    @Query('preferedContactMethod') preferedContactMethod?: string,
  ) {
    const contacts = await this.contactService.searchContacts({
      name,
      email,
      position,
      preferedContactMethod,
    });
    return {
      message: 'Contacts search results',
      data: contacts,
      count: contacts.length,
      statusCode: 200,
    };
  }
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.RH)
  @Get(':id')
  async getContactById(@Param('id') id: string) {
    return this.contactService.getContactById(id);
  } 
  @Get()
  @Roles(UserRole.ADMIN, UserRole.RH)
  async findAllContacts(@Res() response: Response): Promise<Response>{
    try{
      const getContacts = await this.contactService.findAll();
      return response.status(HttpStatus.OK).json({
        message: 'listing of all contacs goes successfully',
        getContacts,
        statusCode: 200,
      });
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something went wrong when fetching contacts please try again later',
        error : (error as Error).message,
        statusCode: 400,
      })
    }
  }
  
  @Patch('update/:id')
  @Roles(UserRole.ADMIN, UserRole.RH)
  async updateContact(@Res() response: Response, @Param('id') id: string, @Body() updateContactDto: UpdateContactDto, userId: string):Promise<Response>{
    try{
      const updatedContact = await this.contactService.updateContact(id, updateContactDto,userId);
      return response.status(HttpStatus.ACCEPTED).json({
        message: 'contact updated successfully',
        updatedContact,
        statusCode: 202,
      });
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something went wrong when updating contact please try again later',
        error: (error as Error).message,
        statusCode: 400,
      });
    }
  }
  @Delete('delete/:id')
  @Roles(UserRole.ADMIN, UserRole.RH)
  async removeContact(@Res() response: Response, @Param('id') id:string, userId: string): Promise<Response>{
    try{
      const deleteContact = await this.contactService.removeContact(id, userId);
      return response.status(HttpStatus.OK).json({
        message: 'deleting contact goes successfully',
        deleteContact,
        statusCode: 200,
      })
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something went wrong when deleting contact please try again later',
        error: (error as Error).message,
        statusCode: 400,
      });
    }
  }
  @Get()
  @UseGuards(AccessTokenGuards)
  @ApiBearerAuth('jwt')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  async findAll(@Query() query: PaginiationQueryDto) {
    return this.contactService.findAllcontacts(query);
  }
  @Get('my-contacts')
  @UseGuards(AccessTokenGuards, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.RH)
  getMyContacts(@Req() req: RequestWithUser) {
    const userId = req.user?.sub;
    console.log('Fetching contacts for user ID:', req.user?.sub);

    if(!userId){
      throw new Error(`User with id : ${userId} not found`)
    }
    return this.contactService.getContactsByUser(userId);
  }
  
  
}

