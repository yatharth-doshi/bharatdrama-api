import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class SubscriptionsService {
    constructor(@Inject(PrismaService) private prisma: PrismaService) { }

    async getAllPlans() {
        const plans = await this.prisma.subscriptionPlan.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
        });

        return { message: 'Plans retrieved', data: plans };
    }

    async getPlanById(planId: string) {
        const plan = await this.prisma.subscriptionPlan.findUnique({
            where: { id: planId },
            include: { contents: true },
        });

        if (!plan) throw new NotFoundException('Plan not found');
        return { message: 'Plan retrieved', data: plan };
    }

    async getUserSubscription(userId: string) {
        const subscription = await this.prisma.subscription.findFirst({
            where: { userId, status: 'ACTIVE' },
            include: { plan: true },
        });

        if (!subscription) {
            return { message: 'No active subscription', data: null };
        }

        return { message: 'Subscription retrieved', data: subscription };
    }

    async subscribeToPlan(userId: string, planId: string, billingCycle: 'monthly' | 'yearly') {
        const plan = await this.prisma.subscriptionPlan.findUnique({
            where: { id: planId },
        });

        if (!plan) throw new NotFoundException('Plan not found');

        const startDate = new Date();
        const endDate = new Date();
        if (billingCycle === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const subscription = await this.prisma.subscription.create({
            data: {
                userId,
                planId,
                startDate,
                endDate,
                status: 'PENDING',
            },
        });

        return { message: 'Subscription created', data: subscription };
    }

    async cancelSubscription(userId: string, subscriptionId: string) {
        const subscription = await this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                status: 'CANCELLED',
                cancellationDate: new Date(),
            },
        });

        return { message: 'Subscription cancelled', data: subscription };
    }

    async renewSubscription(subscriptionId: string) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: subscriptionId },
        });

        if (!subscription) throw new NotFoundException('Subscription not found');

        const newEndDate = new Date(subscription.endDate);
        newEndDate.setMonth(newEndDate.getMonth() + 1);

        const updated = await this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                status: 'ACTIVE',
                endDate: newEndDate,
                renewalDate: new Date(),
            },
        });

        return { message: 'Subscription renewed', data: updated };
    }
}
