import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PreferredContactMethod } from "../Enum/PreferedContactMethod";

export class CreateContactDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsString()
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    @IsString()
    phone: string;
    @IsNotEmpty()
    @IsString()
    position: string;
    @IsEnum(PreferredContactMethod)
    @IsOptional()
    preferedContactMethod: PreferredContactMethod;
    @IsBoolean()
    isActive: boolean;
    @IsString()
    enterpriseId: string;
}
