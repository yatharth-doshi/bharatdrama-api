import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { PromotionService } from './promotion.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { AdminGuard } from '../../common/guards/admin.guard.js';
import { PromotionType } from '../../generated/prisma/index.js';

@Controller('promotions')
export class PromotionController {
    constructor(@Inject(PromotionService) private promotionService: PromotionService) { }

    @Get('active')
    async getActivePromotions() {
        return this.promotionService.getActivePromotions();
    }

    // Admin Endpoints
    @Post()
    @UseGuards(JwtGuard, AdminGuard)
    async createPromotion(@Body() body: any) {
        return this.promotionService.createPromotion(body);
    }

    @Get(':id')
    @UseGuards(JwtGuard, AdminGuard)
    async getPromotionById(@Param('id') id: string) {
        return this.promotionService.getPromotionById(id);
    }

    @Put(':id')
    @UseGuards(JwtGuard, AdminGuard)
    async updatePromotion(@Param('id') id: string, @Body() body: any) {
        return this.promotionService.updatePromotion(id, body);
    }

    @Delete(':id')
    @UseGuards(JwtGuard, AdminGuard)
    async deletePromotion(@Param('id') id: string) {
        return this.promotionService.deletePromotion(id);
    }

    @Post(':id/content/:contentId')
    @UseGuards(JwtGuard, AdminGuard)
    async addContentToPromotion(@Param('id') id: string, @Param('contentId') contentId: string) {
        return this.promotionService.addContentToPromotion(id, contentId);
    }
}
