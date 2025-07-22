import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateFeedbackDto {

    @IsString()
    content: string;
    @IsOptional()
    @IsNumber()
    rating?: number;
    @IsOptional()
    @IsArray()
    @IsString({each: true})
    tags? : string[]
    @IsBoolean()
    isActive: boolean;
    @IsString()
    enterpriseId: string;
    @IsString()
    contactId: string;
}
