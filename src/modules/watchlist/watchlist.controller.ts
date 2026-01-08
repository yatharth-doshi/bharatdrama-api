import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards, Inject } from '@nestjs/common';
import { WatchlistService } from './watchlist.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('watchlist')
export class WatchlistController {
    constructor(@Inject(WatchlistService) private watchlistService: WatchlistService) { }

    @Get()
    @UseGuards(JwtGuard)
    async getWatchlist(
        @CurrentUser() user: any,
        @Query('profileId') profileId: string,
        @Query('skip') skip?: string,
        @Query('take') take?: string,
    ) {
        return this.watchlistService.getWatchlist(user.id, profileId, parseInt(skip || '0'), parseInt(take || '20'));
    }

    @Post()
    @UseGuards(JwtGuard)
    async addToWatchlist(
        @CurrentUser() user: any,
        @Body() body: { profileId: string; contentId: string },
    ) {
        return this.watchlistService.addToWatchlist(user.id, body.profileId, body.contentId);
    }

    @Delete(':profileId/:contentId')
    @UseGuards(JwtGuard)
    async removeFromWatchlist(
        @Param('profileId') profileId: string,
        @Param('contentId') contentId: string,
    ) {
        return this.watchlistService.removeFromWatchlist(profileId, contentId);
    }
}
