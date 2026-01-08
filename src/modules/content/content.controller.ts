import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Inject } from '@nestjs/common';
import { ContentService } from './content.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { AdminGuard } from '../../common/guards/admin.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

import { HomeService } from './home.service.js';

@Controller('content')
export class ContentController {
    constructor(
        @Inject(ContentService) private contentService: ContentService,
        @Inject(HomeService) private homeService: HomeService,
    ) { }

    @Get('home')
    @UseGuards(JwtGuard)
    async getHomeData(@CurrentUser() user: any, @Query('profileId') profileId: string) {
        return this.homeService.getHomeData(user.id, profileId);
    }

    @Get()
    async getAllContent(@Query('skip') skip?: string, @Query('take') take?: string) {
        return this.contentService.getAllContent(parseInt(skip || '0'), parseInt(take || '10'));
    }

    @Get('search')
    async searchContent(@Query('q') query: string) {
        return this.contentService.searchContent(query);
    }

    @Get('trending')
    async getTrendingContent(@Query('take') take?: string) {
        return this.contentService.getTrendingContent(parseInt(take || '10'));
    }

    @Get('genre/:genreId')
    async getContentByGenre(@Param('genreId') genreId: string, @Query('skip') skip?: string, @Query('take') take?: string) {
        return this.contentService.getContentByGenre(genreId, parseInt(skip || '0'), parseInt(take || '10'));
    }

    @Get(':id')
    async getContentById(@Param('id') contentId: string) {
        return this.contentService.getContentById(contentId);
    }

    @Post()
    @UseGuards(JwtGuard, AdminGuard)
    async createContent(@Body() data: any) {
        return this.contentService.createContent(data);
    }

    @Put(':id')
    @UseGuards(JwtGuard, AdminGuard)
    async updateContent(@Param('id') contentId: string, @Body() data: any) {
        return this.contentService.updateContent(contentId, data);
    }

    @Delete(':id')
    @UseGuards(JwtGuard, AdminGuard)
    async deleteContent(@Param('id') contentId: string) {
        return this.contentService.deleteContent(contentId);
    }
}
