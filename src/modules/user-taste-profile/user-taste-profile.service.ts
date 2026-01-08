import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class UserTasteProfileService {
    constructor(@Inject(PrismaService) private prisma: PrismaService) { }

    async getTasteProfile(profileId: string) {
        const profile = await this.prisma.userTasteProfile.findUnique({
            where: { profileId },
        });
        return { message: 'User taste profile retrieved', data: profile };
    }

    async upsertTasteProfile(userId: string, profileId: string, data: any) {
        const profile = await this.prisma.userTasteProfile.upsert({
            where: { profileId },
            update: {
                genrePreferences: data.genrePreferences,
                actorPreferences: data.actorPreferences,
                languagePreferences: data.languagePreferences,
                watchTimePatterns: data.watchTimePatterns,
            },
            create: {
                userId,
                profileId,
                genrePreferences: data.genrePreferences,
                actorPreferences: data.actorPreferences,
                languagePreferences: data.languagePreferences,
                watchTimePatterns: data.watchTimePatterns,
            },
        });

        return { message: 'User taste profile updated', data: profile };
    }

    async updateProfileFromContent(userId: string, profileId: string, contentId: string) {
        const content = await this.prisma.content.findUnique({
            where: { id: contentId },
            include: { genres: true, languages: true },
        });

        if (!content) return;

        const currentProfile = await this.prisma.userTasteProfile.findUnique({
            where: { profileId },
        });

        const genrePrefs = (currentProfile?.genrePreferences as Record<string, number>) || {};
        const langPrefs = (currentProfile?.languagePreferences as Record<string, number>) || {};

        content.genres.forEach(g => {
            genrePrefs[g.name] = (genrePrefs[g.name] || 0) + 1;
        });

        content.languages.forEach(l => {
            langPrefs[l.name] = (langPrefs[l.name] || 0) + 1;
        });

        await this.prisma.userTasteProfile.upsert({
            where: { profileId },
            update: {
                genrePreferences: genrePrefs,
                languagePreferences: langPrefs,
            },
            create: {
                userId,
                profileId,
                genrePreferences: genrePrefs,
                languagePreferences: langPrefs,
            },
        });
    }
}
