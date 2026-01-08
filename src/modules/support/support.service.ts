import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { SupportTicketStatus, SupportTicketPriority } from '../../generated/prisma/index.js';

@Injectable()
export class SupportService {
    constructor(@Inject(PrismaService) private prisma: PrismaService) { }

    async createTicket(userId: string, data: { subject: string; description: string; priority?: SupportTicketPriority }) {
        const ticket = await this.prisma.supportTicket.create({
            data: {
                userId,
                subject: data.subject,
                description: data.description,
                priority: data.priority || SupportTicketPriority.MEDIUM,
            },
        });
        return { message: 'Support ticket created', data: ticket };
    }

    async getUserTickets(userId: string) {
        const tickets = await this.prisma.supportTicket.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'User tickets retrieved', data: tickets };
    }

    async getTicketById(id: string) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id },
            include: { user: { select: { email: true, firstName: true, lastName: true } } },
        });
        if (!ticket) throw new NotFoundException('Ticket not found');
        return { message: 'Ticket details retrieved', data: ticket };
    }

    // Admin Method
    async updateTicketStatus(id: string, status: SupportTicketStatus) {
        const ticket = await this.prisma.supportTicket.update({
            where: { id },
            data: { status },
        });
        return { message: 'Ticket status updated', data: ticket };
    }

    async getAllTickets(skip = 0, take = 20) {
        const [tickets, total] = await Promise.all([
            this.prisma.supportTicket.findMany({
                include: { user: { select: { email: true, firstName: true } } },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.supportTicket.count(),
        ]);
        return { message: 'All tickets retrieved', data: tickets, pagination: { total, skip, take } };
    }
}
