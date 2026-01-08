import { Controller, Get, Post, Put, Param, Body, UseGuards, Inject, Query } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(@Inject(SubscriptionsService) private subscriptionsService: SubscriptionsService) { }

    @Get('plans')
    async getAllPlans() {
        return this.subscriptionsService.getAllPlans();
    }

    @Get('plans/:id')
    async getPlanById(@Param('id') planId: string) {
        return this.subscriptionsService.getPlanById(planId);
    }

    @Get('my-subscription')
    @UseGuards(JwtGuard)
    async getUserSubscription(@CurrentUser() user: any) {
        return this.subscriptionsService.getUserSubscription(user.id);
    }

    @Post('subscribe/:planId')
    @UseGuards(JwtGuard)
    async subscribeToPlan(
        @CurrentUser() user: any,
        @Param('planId') planId: string,
        @Body() body: { billingCycle: 'monthly' | 'yearly' },
    ) {
        return this.subscriptionsService.subscribeToPlan(user.id, planId, body.billingCycle);
    }

    @Put(':id/cancel')
    @UseGuards(JwtGuard)
    async cancelSubscription(@CurrentUser() user: any, @Param('id') subscriptionId: string) {
        return this.subscriptionsService.cancelSubscription(user.id, subscriptionId);
    }

    @Put(':id/renew')
    @UseGuards(JwtGuard)
    async renewSubscription(@Param('id') subscriptionId: string) {
        return this.subscriptionsService.renewSubscription(subscriptionId);
    }
}
