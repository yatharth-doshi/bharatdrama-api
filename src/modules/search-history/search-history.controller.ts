import { Controller, Get, Post, Delete, Query, Body, UseGuards, Inject } from '@nestjs/common';
import { SearchHistoryService } from './search-history.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('search-history')
export class SearchHistoryController {
    constructor(@Inject(SearchHistoryService) private searchHistoryService: SearchHistoryService) { }

    @Get()
    @UseGuards(JwtGuard)
    async getSearchHistory(
        @CurrentUser() user: any,
        @Query('profileId') profileId: string,
        @Query('take') take?: string,
    ) {
        return this.searchHistoryService.getSearchHistory(user.id, profileId, parseInt(take || '10'));
    }

    @Post()
    @UseGuards(JwtGuard)
    async addSearch(
        @CurrentUser() user: any,
        @Body() body: { profileId: string; query: string },
    ) {
        return this.searchHistoryService.addSearch(user.id, body.profileId, body.query);
    }

    @Delete()
    @UseGuards(JwtGuard)
    async clearSearchHistory(@CurrentUser() user: any, @Query('profileId') profileId: string) {
        return this.searchHistoryService.clearSearchHistory(user.id, profileId);
    }
}
