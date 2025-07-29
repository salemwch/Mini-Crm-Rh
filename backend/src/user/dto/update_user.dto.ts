import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, UserRole } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    
}
