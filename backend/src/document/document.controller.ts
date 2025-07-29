import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, Res, HttpStatus, UnauthorizedException, UseGuards, Query } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Roles } from 'src/guards/role.decorator';
import { UserRole } from 'src/user/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { AccessTokenGuards } from 'src/guards/accessToken.guards';
import { DocumentEntity } from './entities/document.entity';
interface JwtPayloadWithRole {
  sub: string;
  email: string;
  role: UserRole;
}
interface RequestWithUser extends Request {
  user?: JwtPayloadWithRole;
}
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

 @Post('create')
 @UseGuards(AccessTokenGuards)
 @Roles(UserRole.ADMIN, UserRole.RH)
 @UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads/document',
    filename: (req, file, cb) =>{
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (req, file, cb) =>{
    if(file.mimetype !== 'application/pdf') {
      return cb(new Error('only pdf files are allowed'), false);
    }
    cb(null, true);
  },
 }))
 uploadDocument(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateDocumentDto, @Req() req: RequestWithUser){
  const fileURl = `/uploads/document/${file.filename}`;
  if(!req.user){
    throw new UnauthorizedException('User not found');
  }
  return this.documentService.create(dto, fileURl,req.user.sub);
 }
 @Get()
 @Roles(UserRole.ADMIN, UserRole.RH)
 async findAll(@Res() response: Response): Promise<Response>{
  try{
    const document = await this.documentService.findAll();
    return response.status(HttpStatus.OK).json({
      message: 'fetching list of all documents goes successfully',
      document,
      statusCode: 200,
    });
  }catch(error){
    return response.status(HttpStatus.BAD_REQUEST).json({
      message: 'something went wrong when fetching documents please try again later',
      error: (error as Error).message,
      statusCode: 400,
    });
  }
 }
  @Get('enterprise/:id')
  @Roles(UserRole.ADMIN, UserRole.RH)
  async findByEnterprise(@Res() response: Response, @Param('id') id: string): Promise<Response> {
    try {
      const documents = await this.documentService.findByEnterprise(id);
      return response.status(HttpStatus.OK).json({
        message: 'Documents fetched successfully by enterprise ID',
        documents,
        statusCode: 200,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Something went wrong when fetching documents by enterprise ID. Please try again later.',
        error: (error as Error).message,
        statusCode: 400,
      });
    }
  }
 @Delete('id')
 @Roles(UserRole.ADMIN)
 async removeDocument(@Res() response: Response, @Param('id') id: string): Promise<Response>{
  try{
    const removeDocument = await this.documentService.remove(id);
    return response.status(HttpStatus.OK).json({
      message: 'document deleted suvessfully',
      removeDocument,
      statusCode: 200,
    });
  }catch(error){
    return response.status(HttpStatus.BAD_REQUEST).json({
      message: 'something went wrong when deleting document please try again later',
      error: (error as Error).message,
      statusCode: 400
    });
  }
 }
 @Get('/by-feedback/:id')
 async findFeedback(@Res() response: Response, @Param('id') id: string): Promise<Response>{
  try{
    const getFeedbackDocument = await this.documentService.findFeedback(id);
    return response.status(HttpStatus.OK).json({
      message: 'fetching by feedback id goes successfully',
      getFeedbackDocument,
      statusCode: 200,
    })
  }catch(error){
    return response.status(HttpStatus.BAD_REQUEST).json({
      message: `something went wrong when fetching by feedback ${id} please try again later`,
      error: (error as Error).message,
      statusCode: 400,
    });
  }
 }
 @Get('/by-contact/:id')
 async getContactDocuments(@Res() response: Response, @Param('id') id: string): Promise<Response>{
  try{
    const getContactDocuments = await this.documentService.findByContacts(id);
    return response.status(HttpStatus.OK).json({
      message: 'fetching by Contact id goes Successfully',
      getContactDocuments,
      statusCode: 200,
    })
  }catch(error){
    return response.status(HttpStatus.BAD_REQUEST).json({
      message: `something went wrong when fetching document by contact ${id} please try again later` 
    })
  }
 }
 @Get('by-jobOffer/:id')
 async getDocumentsByJobOffer(@Res() response: Response, @Param('id') id: string): Promise<Response>{
  try{
    const getDocumentByJobOffer = await this.documentService.findByJobOffer(id);
    return response.status(HttpStatus.OK).json({
      message: 'fetching by job Offer id goes Successfully',
      getDocumentByJobOffer,
      statusCode: 200,
    })
  }catch(error){
    return response.status(HttpStatus.BAD_REQUEST).json({
      message: `Fetching Document By jobOffer ${id} went Wrong please try again later`,
    });
  }
 }
  @Get('search')
  async searchByName(@Query('name') name: string): Promise<DocumentEntity[]> {
    return this.documentService.searchByName(name);
  }
}
