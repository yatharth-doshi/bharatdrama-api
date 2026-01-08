import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ProfilesService {
    constructor(@Inject(PrismaService) private prisma: PrismaService) { }

    async createProfile(userId: string, data: { name: string; isKidsProfile?: boolean }) {
        const profile = await this.prisma.profile.create({
            data: {
                userId,
                name: data.name,
                isKidsProfile: data.isKidsProfile || false,
            },
        });

        return { message: 'Profile created successfully', data: profile };
    }

    async getUserProfiles(userId: string) {
        const profiles = await this.prisma.profile.findMany({
            where: { userId },
        });

        return { message: 'Profiles retrieved successfully', data: profiles };
    }

    async updateProfile(profileId: string, data: { name?: string; avatarUrl?: string }) {
        const profile = await this.prisma.profile.update({
            where: { id: profileId },
            data,
        });

        return { message: 'Profile updated successfully', data: profile };
    }

    async deleteProfile(profileId: string) {
        await this.prisma.profile.delete({ where: { id: profileId } });
        return { message: 'Profile deleted successfully' };
    }
}
