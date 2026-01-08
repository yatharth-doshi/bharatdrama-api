import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class UsersService {
    constructor(@Inject(PrismaService) private prisma: PrismaService) { }

    async getUserProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
                role: true,
                isActive: true,
                emailVerified: true,
                phoneVerified: true,
                createdAt: true,
                subscriptions: {
                    where: { status: 'ACTIVE' },
                    select: {
                        id: true,
                        plan: true,
                        endDate: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            message: 'User profile retrieved successfully',
            data: user,
        };
    }

    async updateUserProfile(
        userId: string,
        updateData: {
            firstName?: string;
            lastName?: string;
            profilePicture?: string;
            phone?: string;
        },
    ) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
                phone: true,
            },
        });

        return {
            message: 'User profile updated successfully',
            data: user,
        };
    }

    async getAllUsers(skip = 0, take = 10) {
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                },
            }),
            this.prisma.user.count(),
        ]);

        return {
            message: 'Users retrieved successfully',
            data: users,
            pagination: {
                total,
                skip,
                take,
                pages: Math.ceil(total / take),
            },
        };
    }

    async getUserById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                isBlocked: true,
                createdAt: true,
                profiles: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            message: 'User retrieved successfully',
            data: user,
        };
    }

    async blockUser(userId: string) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { isBlocked: true },
            select: { id: true, email: true, isBlocked: true },
        });

        return {
            message: 'User blocked successfully',
            data: user,
        };
    }

    async unblockUser(userId: string) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { isBlocked: false },
            select: { id: true, email: true, isBlocked: true },
        });

        return {
            message: 'User unblocked successfully',
            data: user,
        };
    }
}
