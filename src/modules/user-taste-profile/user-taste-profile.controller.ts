import { Controller, Get, Post, Body, Query, UseGuards, Inject } from '@nestjs/common';
import { UserTasteProfileService } from './user-taste-profile.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('taste-profile')
export class UserTasteProfileController {
    constructor(@Inject(UserTasteProfileService) private tasteProfileService: UserTasteProfileService) { }

    @Get()
    @UseGuards(JwtGuard)
    async getTasteProfile(@Query('profileId') profileId: string) {
        return this.tasteProfileService.getTasteProfile(profileId);
    }

    @Post()
    @UseGuards(JwtGuard)
    async upsertTasteProfile(@CurrentUser() user: any, @Body() body: any) {
        const { profileId, ...data } = body;
        return this.tasteProfileService.upsertTasteProfile(user.id, profileId, data);
    }
}
