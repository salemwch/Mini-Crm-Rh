import { IsNumberString, IsOptional, IsString } from "class-validator";

export class PaginiationQueryDto {
    @IsOptional()
    @IsNumberString()
    page?: string;
    @IsOptional()
    @IsNumberString()
    limit?: string;
    @IsOptional()
    @IsString()
    search?: string;
    @IsOptional()
    @IsString()
    isActive?: string;
    @IsOptional()
    @IsString()
    sector?: string;
    @IsOptional()
    @IsString()
    isApproved?: string;
}
