import { PartialType } from '@nestjs/mapped-types';
import { CreateJobOfferDto } from './createjoboffer.dto';
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateJobOfferDto extends PartialType(CreateJobOfferDto) {
  @IsString()
  @IsOptional()
  title?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsOptional()
  location?: string;
  @IsArray()
  @IsOptional()
  requirements?: string[];
  @IsNumber()
  @IsOptional()
  salary?: number;
  @IsDateString()
  @IsOptional()
  expiryDate?: Date;
  @IsString()
  @IsOptional()
  status?: 'open' | 'closed' | 'paused' | 'expired';
}
