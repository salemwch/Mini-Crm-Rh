import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/user/dto/create-user.dto';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.get<UserRole[]>(
            'role',
            context.getHandler()
        );
        if (!requiredRole) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            console.log('roleguard : user is not defind in request');
            throw new UnauthorizedException('User not authenticated');
        }
        console.log(
            `role guard: user role is ${user.role} required role: ${requiredRole}`
        );
        return requiredRole.includes(user.role);
    }
}
