import { Injectable, Inject } from '@nestjs/common';
import { ContentService } from './content.service.js';
import { RecommendationService } from '../recommendation/recommendation.service.js';
import { WatchHistoryService } from '../watch-history/watch-history.service.js';
import { PromotionService } from '../promotion/promotion.service.js';

@Injectable()
export class HomeService {
    constructor(
        @Inject(ContentService) private contentService: ContentService,
        @Inject(RecommendationService) private recommendationService: RecommendationService,
        @Inject(WatchHistoryService) private watchHistoryService: WatchHistoryService,
        @Inject(PromotionService) private promotionService: PromotionService,
    ) { }

    async getHomeData(userId: string, profileId: string) {
        const [promotions, topPicks, continueWatching, trending] = await Promise.all([
            this.promotionService.getActivePromotions(),
            this.recommendationService.getRecommendations(profileId, 10),
            this.watchHistoryService.getContinueWatching(userId, profileId, 10),
            this.contentService.getTrendingContent(10),
        ]);

        return {
            message: 'Home data retrieved',
            data: {
                hero: promotions.data[0] || null, // Top banner
                promotions: promotions.data,
                topPicks: topPicks.data,
                continueWatching: continueWatching.data,
                trending: trending.data,
            }
        };
    }
}
