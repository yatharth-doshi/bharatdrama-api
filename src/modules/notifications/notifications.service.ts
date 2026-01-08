import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { NotificationType } from '../../generated/prisma/index.js';

@Injectable()
export class NotificationsService {
    constructor(@Inject(PrismaService) private prisma: PrismaService) { }

    async getNotifications(userId: string, skip = 0, take = 20) {
        const [notifications, total] = await Promise.all([
            this.prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.notification.count({ where: { userId } }),
        ]);

        return { message: 'Notifications retrieved', data: notifications, pagination: { total, skip, take } };
    }

    async getUnreadCount(userId: string) {
        const count = await this.prisma.notification.count({
            where: { userId, isRead: false },
        });

        return { message: 'Unread count', data: { unreadCount: count } };
    }

    async markAsRead(notificationId: string) {
        const notification = await this.prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true, readAt: new Date() },
        });

        return { message: 'Notification marked as read', data: notification };
    }

    async markAllAsRead(userId: string) {
        await this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true, readAt: new Date() },
        });

        return { message: 'All notifications marked as read' };
    }

    async deleteNotification(notificationId: string) {
        await this.prisma.notification.delete({ where: { id: notificationId } });
        return { message: 'Notification deleted' };
    }

    async sendNotification(userId: string, data: {
        type: NotificationType;
        title: string;
        message: string;
        actionUrl?: string;
    }) {
        const notification = await this.prisma.notification.create({
            data: {
                userId,
                type: data.type,
                title: data.title,
                message: data.message,
                actionUrl: data.actionUrl,
            },
        });

        return { message: 'Notification sent', data: notification };
    }

    async sendBulkNotification(userIds: string[], data: {
        type: NotificationType;
        title: string;
        message: string;
        actionUrl?: string;
    }) {
        const notifications = await Promise.all(
            userIds.map((userId) =>
                this.prisma.notification.create({
                    data: {
                        userId,
                        type: data.type,
                        title: data.title,
                        message: data.message,
                        actionUrl: data.actionUrl,
                    },
                }),
            ),
        );

        return { message: 'Bulk notifications sent', data: { count: notifications.length } };
    }
}
