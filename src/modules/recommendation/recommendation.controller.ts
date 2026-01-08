import { Controller, Get, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { RecommendationService } from './recommendation.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';

@Controller('recommendations')
export class RecommendationController {
    constructor(@Inject(RecommendationService) private recommendationService: RecommendationService) { }

    @Get()
    @UseGuards(JwtGuard)
    async getRecommendations(
        @Query('profileId') profileId: string,
        @Query('take') take?: string,
    ) {
        return this.recommendationService.getRecommendations(profileId, parseInt(take || '10'));
    }

    @Get('similar/:contentId')
    async getSimilarContent(
        @Param('contentId') contentId: string,
        @Query('take') take?: string,
    ) {
        return this.recommendationService.getSimilarContent(contentId, parseInt(take || '5'));
    }
}
