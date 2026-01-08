import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AdminService {
    constructor(@Inject(PrismaService) private prisma: PrismaService) { }

    async getDashboardStats() {
        const [totalUsers, activeSubscriptions, totalRevenue, totalContent, activePromotions, openTickets] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
            this.prisma.payment.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { amount: true },
            }),
            this.prisma.content.count({ where: { isActive: true } }),
            this.prisma.promotion.count({ where: { isActive: true } }),
            this.prisma.supportTicket.count({ where: { status: 'OPEN' } }),
        ]);

        return {
            message: 'Dashboard stats retrieved',
            data: {
                totalUsers,
                activeSubscriptions,
                totalRevenue: totalRevenue._sum.amount || 0,
                totalContent,
                activePromotions,
                openTickets,
            },
        };
    }

    async getMostWatchedContent(take = 10) {
        const content = await this.prisma.content.findMany({
            where: { isActive: true },
            orderBy: { viewCount: 'desc' },
            take,
        });

        return { message: 'Most watched content', data: content };
    }

    async getRevenueStats(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const revenue = await this.prisma.payment.aggregate({
            where: {
                status: 'COMPLETED',
                createdAt: { gte: startDate },
            },
            _sum: { amount: true },
            _count: true,
        });

        return {
            message: 'Revenue stats',
            data: {
                totalRevenue: revenue._sum.amount || 0,
                transactionCount: revenue._count,
                period: `Last ${days} days`,
            },
        };
    }

    async getUserGrowthStats() {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const newUsers = await this.prisma.user.count({
            where: { createdAt: { gte: last30Days } },
        });

        return {
            message: 'User growth stats',
            data: { newUsersLast30Days: newUsers },
        };
    }

    async createContentItem(data: any) {
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

    async createSubscriptionPlan(data: any) {
        const plan = await this.prisma.subscriptionPlan.create({
            data: {
                name: data.name,
                description: data.description,
                monthlyPrice: data.monthlyPrice,
                yearlyPrice: data.yearlyPrice,
                maxProfiles: data.maxProfiles || 1,
                maxConcurrentStreams: data.maxConcurrentStreams || 1,
                isAdFree: data.isAdFree || false,
                isDownloadEnabled: data.isDownloadEnabled || false,
            },
        });

        return { message: 'Subscription plan created', data: plan };
    }

    async updateSubscriptionPlan(planId: string, data: any) {
        const plan = await this.prisma.subscriptionPlan.update({
            where: { id: planId },
            data,
        });

        return { message: 'Plan updated', data: plan };
    }

    async deleteSubscriptionPlan(planId: string) {
        await this.prisma.subscriptionPlan.delete({ where: { id: planId } });
        return { message: 'Plan deleted' };
    }

    async logAdminAction(adminId: string, action: string, entityType: string, entityId: string, changes?: any) {
        const log = await this.prisma.adminLog.create({
            data: {
                adminId,
                action,
                entityType,
                entityId,
                changes,
            },
        });

        return { message: 'Action logged', data: log };
    }

    async getAdminLogs(skip = 0, take = 20) {
        const [logs, total] = await Promise.all([
            this.prisma.adminLog.findMany({
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.adminLog.count(),
        ]);

        return { message: 'Admin logs retrieved', data: logs, pagination: { total, skip, take } };
    }
}
