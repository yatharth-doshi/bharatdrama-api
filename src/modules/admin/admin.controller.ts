import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Inject, Query } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { AdminGuard } from '../../common/guards/admin.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('admin')
@UseGuards(JwtGuard, AdminGuard)
export class AdminController {
    constructor(@Inject(AdminService) private adminService: AdminService) { }

    @Get('dashboard')
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('content/most-watched')
    async getMostWatchedContent(@Query('take') take?: string) {
        return this.adminService.getMostWatchedContent(parseInt(take || '10'));
    }

    @Get('revenue/stats')
    async getRevenueStats(@Query('days') days?: string) {
        return this.adminService.getRevenueStats(parseInt(days || '30'));
    }

    @Get('users/growth')
    async getUserGrowthStats() {
        return this.adminService.getUserGrowthStats();
    }

    @Post('content')
    async createContentItem(@Body() data: any) {
        return this.adminService.createContentItem(data);
    }

    @Post('plans')
    async createSubscriptionPlan(@Body() data: any) {
        return this.adminService.createSubscriptionPlan(data);
    }

    @Put('plans/:id')
    async updateSubscriptionPlan(@Param('id') planId: string, @Body() data: any) {
        return this.adminService.updateSubscriptionPlan(planId, data);
    }

    @Delete('plans/:id')
    async deleteSubscriptionPlan(@Param('id') planId: string) {
        return this.adminService.deleteSubscriptionPlan(planId);
    }

    @Get('logs')
    async getAdminLogs(@Query('skip') skip?: string, @Query('take') take?: string) {
        return this.adminService.getAdminLogs(parseInt(skip || '0'), parseInt(take || '20'));
    }
}
