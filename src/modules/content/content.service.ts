import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ContentService {
    constructor(@Inject(PrismaService) private prisma: PrismaService) { }

    async getAllContent(skip = 0, take = 10) {
        const [content, total] = await Promise.all([
            this.prisma.content.findMany({
                where: { isActive: true },
                skip,
                take,
                include: { genres: true, languages: true },
            }),
            this.prisma.content.count({ where: { isActive: true } }),
        ]);

        return { message: 'Content retrieved successfully', data: content, pagination: { total, skip, take } };
    }

    async getContentById(contentId: string) {
        const content = await this.prisma.content.findUnique({
            where: { id: contentId },
            include: {
                genres: true,
                languages: true,
                cast: true,
                directors: true,
                videos: true,
            },
        });

        if (!content) throw new NotFoundException('Content not found');
        return { message: 'Content retrieved successfully', data: content };
    }

    async searchContent(query: string, take = 10) {
        const content = await this.prisma.content.findMany({
            where: {
                isActive: true,
                title: { contains: query, mode: 'insensitive' },
            },
            take,
        });

        return { message: 'Search results', data: content };
    }

    async getContentByGenre(genreId: string, skip = 0, take = 10) {
        const content = await this.prisma.content.findMany({
            where: {
                isActive: true,
                genres: { some: { id: genreId } },
            },
            skip,
            take,
        });

        return { message: 'Content retrieved by genre', data: content };
    }

    async getTrendingContent(take = 10) {
        const content = await this.prisma.content.findMany({
            where: { isActive: true },
            orderBy: { viewCount: 'desc' },
            take,
        });

        return { message: 'Trending content retrieved', data: content };
    }

    async createContent(data: any) {
        const content = await this.prisma.content.create({
            data: {
                title: data.title,
                description: data.description,
                contentType: data.contentType,
                posterUrl: data.posterUrl,
                bannerUrl: data.bannerUrl,
                releaseDate: data.releaseDate,
                isAdult: data.isAdult || false,
            },
        });

        return { message: 'Content created successfully', data: content };
    }

    async updateContent(contentId: string, data: any) {
        const content = await this.prisma.content.update({
            where: { id: contentId },
            data,
        });

        return { message: 'Content updated successfully', data: content };
    }

    async deleteContent(contentId: string) {
        await this.prisma.content.delete({ where: { id: contentId } });
        return { message: 'Content deleted successfully' };
    }
}
