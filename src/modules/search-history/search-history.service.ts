import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class SearchHistoryService {
    constructor(@Inject(PrismaService) private prisma: PrismaService) { }

    async getSearchHistory(userId: string, profileId: string, take = 10) {
        const history = await this.prisma.searchHistory.findMany({
            where: { userId, profileId },
            orderBy: { createdAt: 'desc' },
            take,
        });

        return { message: 'Search history retrieved', data: history };
    }

    async addSearch(userId: string, profileId: string, query: string) {
        if (!query || query.trim() === '') return;

        const search = await this.prisma.searchHistory.create({
            data: { userId, profileId, query: query.trim() },
        });

        return { message: 'Search query recorded', data: search };
    }

    async clearSearchHistory(userId: string, profileId: string) {
        await this.prisma.searchHistory.deleteMany({
            where: { userId, profileId },
        });

        return { message: 'Search history cleared' };
    }
}
