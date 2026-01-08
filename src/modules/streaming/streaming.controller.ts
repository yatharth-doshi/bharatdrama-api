import { Controller, Get, Post, Param, Body, UseGuards, Inject, Query } from '@nestjs/common';
import { StreamingService } from './streaming.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('streaming')
export class StreamingController {
    constructor(@Inject(StreamingService) private streamingService: StreamingService) { }

    @Get('watch/:contentId/:videoId')
    @UseGuards(JwtGuard)
    async getStreamingUrl(
        @Param('contentId') contentId: string,
        @Param('videoId') videoId: string,
        @CurrentUser() user: any,
    ) {
        return this.streamingService.getStreamingUrl(contentId, videoId, user.id);
    }

    @Post('watch-progress/:videoId')
    @UseGuards(JwtGuard)
    async updateWatchProgress(
        @Param('videoId') videoId: string,
        @CurrentUser() user: any,
        @Body() body: { watchedDuration: number },
    ) {
        return this.streamingService.updateWatchProgress(videoId, user.id, body.watchedDuration);
    }

    @Get('qualities/:videoId')
    async getVideoQualityOptions(@Param('videoId') videoId: string) {
        return this.streamingService.getVideoQualityOptions(videoId);
    }
}
