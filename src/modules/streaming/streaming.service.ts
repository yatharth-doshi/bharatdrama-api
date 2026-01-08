import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

import { UserTasteProfileService } from '../user-taste-profile/user-taste-profile.service.js';

@Injectable()
export class StreamingService {
    constructor(
        @Inject(PrismaService) private prisma: PrismaService,
        @Inject(UserTasteProfileService) private tasteProfileService: UserTasteProfileService
    ) { }

    async getStreamingUrl(contentId: string, videoId: string, userId: string) {
        const video = await this.prisma.video.findUnique({
            where: { id: videoId },
            include: { subtitles: true, audioTracks: true },
        });

        if (!video) throw new NotFoundException('Video not found');

        // Check if user has access
        const subscription = await this.prisma.subscription.findFirst({
            where: { userId, status: 'ACTIVE' },
        });

        if (!subscription && userId !== 'public') {
            throw new BadRequestException('No active subscription');
        }

        // Record watch history
        const profile = await this.prisma.profile.findFirst({
            where: { userId },
        });

        if (profile) {
            await this.prisma.watchHistory.upsert({
                where: {
                    userId_profileId_videoId: {
                        userId,
                        profileId: profile.id,
                        videoId,
                    },
                },
                update: { watchedAt: new Date() },
                create: {
                    userId,
                    profileId: profile.id,
                    contentId,
                    videoId,
                    watchedDuration: 0,
                    totalDuration: video.duration,
                },
            });
        }

        return {
            message: 'Streaming URL retrieved',
            data: {
                videoUrl: video.cloudFrontUrl || video.s3Url,
                thumbnailUrl: video.thumbnailUrl,
                duration: video.duration,
                subtitles: video.subtitles,
                audioTracks: video.audioTracks,
            },
        };
    }

    async updateWatchProgress(videoId: string, userId: string, watchedDuration: number) {
        const profile = await this.prisma.profile.findFirst({
            where: { userId },
        });

        if (!profile) throw new NotFoundException('Profile not found');

        const video = await this.prisma.video.findUnique({
            where: { id: videoId },
        });

        if (!video) throw new NotFoundException('Video not found');

        const watchHistory = await this.prisma.watchHistory.update({
            where: {
                userId_profileId_videoId: {
                    userId,
                    profileId: profile.id,
                    videoId,
                },
            },
            data: {
                watchedDuration,
                isCompleted: watchedDuration >= video.duration * 0.9, // 90% watched
            },
        });

        if (watchHistory.isCompleted) {
            await this.tasteProfileService.updateProfileFromContent(userId, profile.id, watchHistory.contentId);
        }

        return { message: 'Watch progress updated', data: watchHistory };
    }

    async getVideoQualityOptions(videoId: string) {
        // Return available quality options
        return {
            message: 'Available qualities',
            data: {
                qualities: [
                    { id: 'AUTO', label: 'Auto', bitrate: 'Adaptive' },
                    { id: 'SD_360P', label: '360p', bitrate: '500 kbps' },
                    { id: 'HD_720P', label: '720p', bitrate: '2500 kbps' },
                    { id: 'FHD_1080P', label: '1080p', bitrate: '5000 kbps' },
                ],
            },
        };
    }
}
