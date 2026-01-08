import {
    Controller,
    Get,
    Put,
    Param,
    Body,
    Inject,
    UseGuards,
    Query,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { AdminGuard } from '../../common/guards/admin.guard.js';

@Controller('users')
export class UsersController {
    constructor(@Inject(UsersService) private usersService: UsersService) { }

    @Get('profile')
    @UseGuards(JwtGuard)
    async getProfile(@CurrentUser() user: any) {
        return this.usersService.getUserProfile(user.id);
    }

    @Put('profile')
    @UseGuards(JwtGuard)
    async updateProfile(
        @CurrentUser() user: any,
        @Body()
        updateData: {
            firstName?: string;
            lastName?: string;
            profilePicture?: string;
            phone?: string;
        },
    ) {
        return this.usersService.updateUserProfile(user.id, updateData);
    }

    @Get()
    @UseGuards(JwtGuard, AdminGuard)
    async getAllUsers(
        @Query('skip') skip?: string,
        @Query('take') take?: string,
    ) {
        return this.usersService.getAllUsers(parseInt(skip || '0'), parseInt(take || '10'));
    }

    @Get(':id')
    @UseGuards(JwtGuard, AdminGuard)
    async getUserById(@Param('id') userId: string) {
        return this.usersService.getUserById(userId);
    }

    @Put(':id/block')
    @UseGuards(JwtGuard, AdminGuard)
    async blockUser(@Param('id') userId: string) {
        return this.usersService.blockUser(userId);
    }

    @Put(':id/unblock')
    @UseGuards(JwtGuard, AdminGuard)
    async unblockUser(@Param('id') userId: string) {
        return this.usersService.unblockUser(userId);
    }
}
