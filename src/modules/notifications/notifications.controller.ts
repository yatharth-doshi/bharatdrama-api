import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Inject, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { NotificationType } from '../../generated/prisma/index.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { AdminGuard } from '../../common/guards/admin.guard.js';

@Controller('notifications')
export class NotificationsController {
    constructor(@Inject(NotificationsService) private notificationsService: NotificationsService) { }

    @Get()
    @UseGuards(JwtGuard)
    async getNotifications(
        @CurrentUser() user: any,
        @Query('skip') skip?: string,
        @Query('take') take?: string,
    ) {
        return this.notificationsService.getNotifications(user.id, parseInt(skip || '0'), parseInt(take || '20'));
    }

    @Get('unread-count')
    @UseGuards(JwtGuard)
    async getUnreadCount(@CurrentUser() user: any) {
        return this.notificationsService.getUnreadCount(user.id);
    }

    @Put(':id/read')
    @UseGuards(JwtGuard)
    async markAsRead(@Param('id') notificationId: string) {
        return this.notificationsService.markAsRead(notificationId);
    }

    @Put('mark-all-read')
    @UseGuards(JwtGuard)
    async markAllAsRead(@CurrentUser() user: any) {
        return this.notificationsService.markAllAsRead(user.id);
    }

    @Delete(':id')
    @UseGuards(JwtGuard)
    async deleteNotification(@Param('id') notificationId: string) {
        return this.notificationsService.deleteNotification(notificationId);
    }

    @Post('send')
    @UseGuards(JwtGuard, AdminGuard)
    async sendNotification(
        @Body() body: { userId: string; type: NotificationType; title: string; message: string; actionUrl?: string },
    ) {
        return this.notificationsService.sendNotification(body.userId, {
            type: body.type,
            title: body.title,
            message: body.message,
            actionUrl: body.actionUrl,
        });
    }

    @Post('send-bulk')
    @UseGuards(JwtGuard, AdminGuard)
    async sendBulkNotification(
        @Body() body: { userIds: string[]; type: NotificationType; title: string; message: string; actionUrl?: string },
    ) {
        return this.notificationsService.sendBulkNotification(body.userIds, {
            type: body.type,
            title: body.title,
            message: body.message,
            actionUrl: body.actionUrl,
        });
    }
}
