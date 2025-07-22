import { IsEnum, IsNotEmpty } from "class-validator";
import { UserRole } from "./create-user.dto";



export class UpdateUserRole {
@IsNotEmpty()
@IsEnum(UserRole)
role: UserRole;
}