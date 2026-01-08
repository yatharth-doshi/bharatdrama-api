import { Module } from '@nestjs/common';
import { ContentService } from './content.service.js';
import { ContentController } from './content.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

import { HomeService } from './home.service.js';
import { RecommendationModule } from '../recommendation/recommendation.module.js';
import { WatchHistoryModule } from '../watch-history/watch-history.module.js';
import { PromotionModule } from '../promotion/promotion.module.js';

@Module({
    imports: [PrismaModule, RecommendationModule, WatchHistoryModule, PromotionModule],
    controllers: [ContentController],
    providers: [ContentService, HomeService],
    exports: [ContentService, HomeService],
})
export class ContentModule { }
