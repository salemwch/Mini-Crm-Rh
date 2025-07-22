import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateJobOfferDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray({ each: true })
  @IsNotEmpty()
  requirements: string[];

  @IsMongoId()
  @IsNotEmpty()
  enterpriseId: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsNotEmpty()
  salary: number;
  @IsOptional()
  @IsDateString()
  expiryDate?: Date;
}

