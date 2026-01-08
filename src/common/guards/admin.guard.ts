import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new ForbiddenException('User not found');
        }

        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Only admins can access this resource');
        }

        return true;
    }
}
