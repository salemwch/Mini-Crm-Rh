import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateAbsenceStatusDto {
    @IsEnum(['approved', 'rejected'])
    status: 'approved' | 'rejected';

    @IsOptional()
    @IsString()
    responseMessage?: string;
}
