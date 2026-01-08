import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Inject } from '@nestjs/common';
import { ProfilesService } from './profiles.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('profiles')
export class ProfilesController {
    constructor(@Inject(ProfilesService) private profilesService: ProfilesService) { }

    @Get()
    @UseGuards(JwtGuard)
    async getUserProfiles(@CurrentUser() user: any) {
        return this.profilesService.getUserProfiles(user.id);
    }

    @Post()
    @UseGuards(JwtGuard)
    async createProfile(@CurrentUser() user: any, @Body() data: { name: string; isKidsProfile?: boolean }) {
        return this.profilesService.createProfile(user.id, data);
    }

    @Put(':id')
    @UseGuards(JwtGuard)
    async updateProfile(@Param('id') profileId: string, @Body() data: { name?: string; avatarUrl?: string }) {
        return this.profilesService.updateProfile(profileId, data);
    }

    @Delete(':id')
    @UseGuards(JwtGuard)
    async deleteProfile(@Param('id') profileId: string) {
        return this.profilesService.deleteProfile(profileId);
    }
}
