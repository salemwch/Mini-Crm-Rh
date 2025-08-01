import { IsNotEmpty, IsArray, IsMongoId } from 'class-validator';

export class CreateGroupDto {
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsMongoId({ each: true })
    members: string[];
}