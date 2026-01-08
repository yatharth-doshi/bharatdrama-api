import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PromotionType } from '../../generated/prisma/index.js';

@Injectable()
export class PromotionService {
    constructor(@Inject(PrismaService) private prisma: PrismaService) { }

    async createPromotion(data: { title: string; description?: string; promotionType: PromotionType; imageUrl?: string; actionUrl?: string; startDate: Date; endDate: Date }) {
        const promotion = await this.prisma.promotion.create({
            data: {
                ...data,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
            },
        });
        return { message: 'Promotion created successfully', data: promotion };
    }

    async getActivePromotions() {
        const now = new Date();
        const promotions = await this.prisma.promotion.findMany({
            where: {
                isActive: true,
                startDate: { lte: now },
                endDate: { gte: now },
            },
            include: { contents: { include: { content: true } } },
        });
        return { message: 'Active promotions retrieved', data: promotions };
    }

    async getPromotionById(id: string) {
        const promotion = await this.prisma.promotion.findUnique({
            where: { id },
            include: { contents: { include: { content: true } } },
        });
        if (!promotion) throw new NotFoundException('Promotion not found');
        return { message: 'Promotion details retrieved', data: promotion };
    }

    async updatePromotion(id: string, data: any) {
        const promotion = await this.prisma.promotion.update({
            where: { id },
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
        });
        return { message: 'Promotion updated', data: promotion };
    }

    async deletePromotion(id: string) {
        await this.prisma.promotion.delete({ where: { id } });
        return { message: 'Promotion deleted' };
    }

    async addContentToPromotion(promotionId: string, contentId: string) {
        const entry = await this.prisma.promotionContent.create({
            data: { promotionId, contentId },
        });
        return { message: 'Content added to promotion', data: entry };
    }
}
