import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Content } from '../../generated/prisma/index.js';

@Injectable()
export class RecommendationService {
    constructor(@Inject(PrismaService) private prisma: PrismaService) { }

    async getRecommendations(profileId: string, take = 10) {
        // 1. Get Taste Profile
        const tasteProfile = await this.prisma.userTasteProfile.findUnique({
            where: { profileId },
        });

        // 2. Base Query
        const where: any = { isActive: true };

        // 3. Parental Control Filter
        const profile = await this.prisma.profile.findUnique({ where: { id: profileId } });
        if (profile?.isKidsProfile) {
            where.isAdult = false;
        }

        // 4. Recommendation Logic
        let recommendedContent: Content[] = [];

        if (tasteProfile && tasteProfile.genrePreferences) {
            // Recommendation based on Top Genre
            const genres = tasteProfile.genrePreferences as Record<string, number>;
            const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0]?.[0];

            if (topGenre) {
                recommendedContent = await this.prisma.content.findMany({
                    where: {
                        ...where,
                        genres: { some: { name: topGenre } },
                    },
                    orderBy: { trendingScore: 'desc' },
                    take,
                });
            }
        }

        // 5. Fallback to Global Trending if not enough results
        if (recommendedContent.length < take) {
            const extra = await this.prisma.content.findMany({
                where: {
                    ...where,
                    id: { notIn: recommendedContent.map(c => c.id) },
                },
                orderBy: { trendingScore: 'desc' },
                take: take - recommendedContent.length,
            });
            recommendedContent = [...recommendedContent, ...extra];
        }

        return { message: 'Recommendations retrieved', data: recommendedContent };
    }

    async getSimilarContent(contentId: string, take = 5) {
        const content = await this.prisma.content.findUnique({
            where: { id: contentId },
            include: { genres: true },
        });

        if (!content) return { message: 'Similar content', data: [] };

        const genreIds = content.genres.map(g => g.id);

        const similar = await this.prisma.content.findMany({
            where: {
                id: { not: contentId },
                isActive: true,
                genres: { some: { id: { in: genreIds } } },
            },
            orderBy: { trendingScore: 'desc' },
            take,
        });

        return { message: 'Similar content retrieved', data: similar };
    }
}
