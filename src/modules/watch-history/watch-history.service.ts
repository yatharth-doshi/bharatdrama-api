import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class WatchHistoryService {
    constructor(@Inject(PrismaService) private prisma: PrismaService) { }

    async getWatchHistory(userId: string, profileId?: string, skip = 0, take = 20) {
        const where: any = { userId };
        if (profileId) where.profileId = profileId;

        const [watchHistory, total] = await Promise.all([
            this.prisma.watchHistory.findMany({
                where,
                include: { content: { select: { title: true, posterUrl: true } } },
                orderBy: { watchedAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.watchHistory.count({ where }),
        ]);

        return {
            message: 'Watch history retrieved',
            data: watchHistory,
            pagination: { total, skip, take },
        };
    }

    async getContinueWatching(userId: string, profileId: string, take = 10) {
        const watchHistory = await this.prisma.watchHistory.findMany({
            where: {
                userId,
                profileId,
                isCompleted: false,
            },
            include: { content: true },
            orderBy: { watchedAt: 'desc' },
            take,
        });

        return { message: 'Continue watching list', data: watchHistory };
    }

    async deleteWatchHistory(watchHistoryId: string) {
        await this.prisma.watchHistory.delete({ where: { id: watchHistoryId } });
        return { message: 'Watch history deleted' };
    }

    async clearWatchHistory(userId: string) {
        await this.prisma.watchHistory.deleteMany({ where: { userId } });
        return { message: 'Watch history cleared' };
    }
}
