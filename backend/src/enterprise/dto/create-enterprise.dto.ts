import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Max, Min } from "class-validator";

export class CreateEnterpriseDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsNotEmpty()
    secteur: string;
    @IsString()
    @IsNotEmpty()
    address: string;
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
    @IsUrl()
    @IsOptional()
    @IsString()
    website: string;
    @IsString()
    @IsOptional()
    industryCode: string;
    @IsString()
    @IsOptional()
    notes?: string;
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    rating?: number;
    @IsArray()
    @IsOptional()
    @ArrayNotEmpty()
    documents?: string[];
    @IsString()
    @IsOptional()
    phone?: string;
}
