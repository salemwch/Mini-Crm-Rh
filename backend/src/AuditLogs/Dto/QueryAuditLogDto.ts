import { IsOptional, IsString } from 'class-validator';

export class QueryAuditLogDto {
  @IsOptional()
  @IsString()
  action?: string;
}
