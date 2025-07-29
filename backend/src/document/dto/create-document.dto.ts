import { IsNotEmpty, IsString } from "class-validator";

export class CreateDocumentDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsString()
    enterpriseId: string;
}
