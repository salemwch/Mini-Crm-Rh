    import { IsNotEmpty, IsMongoId } from 'class-validator';

    export class CreateMessageDto {
        @IsNotEmpty()
        content: string;
        @IsNotEmpty()
        groupId: string;
    }