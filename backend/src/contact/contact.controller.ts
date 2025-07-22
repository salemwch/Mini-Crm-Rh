import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Roles } from 'src/guards/role.decorator';
import { UserRole } from 'src/user/dto/create-user.dto';
import { Response, response } from 'express';
import { AccessTokenGuards } from 'src/guards/accessToken.guards';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginiationQueryDto } from 'src/common/dto/paginationQuery.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RH)
  async createContact(@Res() response: Response, @Body() createContactDto: CreateContactDto, @Req() req): Promise<Response>{
    try{
      const createdContact = await this.contactService.create(createContactDto, req.user._id);
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
  @Get('enterprise/:enterpriseId')
  @Roles(UserRole.ADMIN, UserRole.RH)
  async findEnterpriseById(@Res() response: Response, @Param('enterpriseId') enterprise: string): Promise<Response>{
    try{
      const findenterPriseById = await this.contactService.findEnterprise(enterprise);
      return response.status(HttpStatus.OK).json({
        message: 'enterprise found successfully',
        findenterPriseById,
        statusCode: 200,
      });
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'something went wrong when fetching enterprise please try again later',
        error: (error as Error).message,
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
}
