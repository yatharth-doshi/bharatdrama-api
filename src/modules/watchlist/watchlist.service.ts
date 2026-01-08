import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class WatchlistService {
    constructor(@Inject(PrismaService) private prisma: PrismaService) { }

    async getWatchlist(userId: string, profileId: string, skip = 0, take = 20) {
        const [watchlist, total] = await Promise.all([
            this.prisma.watchlist.findMany({
                where: { userId, profileId },
                include: { content: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.watchlist.count({ where: { userId, profileId } }),
        ]);

        return {
            message: 'Watchlist retrieved',
            data: watchlist,
            pagination: { total, skip, take },
        };
    }

    async addToWatchlist(userId: string, profileId: string, contentId: string) {
        // Check if content exists
        const content = await this.prisma.content.findUnique({ where: { id: contentId } });
        if (!content) throw new NotFoundException('Content not found');

        // Check if already in watchlist
        const existing = await this.prisma.watchlist.findUnique({
            where: { profileId_contentId: { profileId, contentId } },
        });
        if (existing) throw new ConflictException('Already in watchlist');

        const watchlistItem = await this.prisma.watchlist.create({
            data: { userId, profileId, contentId },
            include: { content: true },
        });

        return { message: 'Added to watchlist', data: watchlistItem };
    }

    async removeFromWatchlist(profileId: string, contentId: string) {
        await this.prisma.watchlist.delete({
            where: { profileId_contentId: { profileId, contentId } },
        });

        return { message: 'Removed from watchlist' };
    }
}
