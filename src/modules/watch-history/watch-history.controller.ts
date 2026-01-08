import { Controller, Get, Delete, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('watch-history')
export class WatchHistoryController {
    constructor(@Inject(WatchHistoryService) private watchHistoryService: WatchHistoryService) { }

    @Get()
    @UseGuards(JwtGuard)
    async getWatchHistory(
        @CurrentUser() user: any,
        @Query('profileId') profileId?: string,
        @Query('skip') skip?: string,
        @Query('take') take?: string,
    ) {
        return this.watchHistoryService.getWatchHistory(user.id, profileId, parseInt(skip || '0'), parseInt(take || '20'));
    }

    @Get('continue-watching')
    @UseGuards(JwtGuard)
    async getContinueWatching(
        @CurrentUser() user: any,
        @Query('profileId') profileId: string,
        @Query('take') take?: string,
    ) {
        return this.watchHistoryService.getContinueWatching(user.id, profileId, parseInt(take || '10'));
    }

    @Delete(':id')
    @UseGuards(JwtGuard)
    async deleteWatchHistory(@Param('id') watchHistoryId: string) {
        return this.watchHistoryService.deleteWatchHistory(watchHistoryId);
    }

    @Delete()
    @UseGuards(JwtGuard)
    async clearWatchHistory(@CurrentUser() user: any) {
        return this.watchHistoryService.clearWatchHistory(user.id);
    }
}
