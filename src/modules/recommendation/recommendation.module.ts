import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller.js';
import { RecommendationService } from './recommendation.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
    imports: [PrismaModule],
    controllers: [RecommendationController],
    providers: [RecommendationService],
    exports: [RecommendationService],
})
export class RecommendationModule { }
