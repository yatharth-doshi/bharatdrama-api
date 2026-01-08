import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { SupportService } from './support.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { AdminGuard } from '../../common/guards/admin.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { SupportTicketStatus, SupportTicketPriority } from '../../generated/prisma/index.js';

@Controller('support')
export class SupportController {
    constructor(@Inject(SupportService) private supportService: SupportService) { }

    @Post('tickets')
    @UseGuards(JwtGuard)
    async createTicket(
        @CurrentUser() user: any,
        @Body() body: { subject: string; description: string; priority?: SupportTicketPriority },
    ) {
        return this.supportService.createTicket(user.id, body);
    }

    @Get('my-tickets')
    @UseGuards(JwtGuard)
    async getMyTickets(@CurrentUser() user: any) {
        return this.supportService.getUserTickets(user.id);
    }

    @Get('tickets/:id')
    @UseGuards(JwtGuard)
    async getTicketById(@Param('id') id: string) {
        return this.supportService.getTicketById(id);
    }

    // Admin Endpoints
    @Get('admin/tickets')
    @UseGuards(JwtGuard, AdminGuard)
    async getAllTickets(@Query('skip') skip?: string, @Query('take') take?: string) {
        return this.supportService.getAllTickets(parseInt(skip || '0'), parseInt(take || '20'));
    }

    @Put('admin/tickets/:id/status')
    @UseGuards(JwtGuard, AdminGuard)
    async updateStatus(@Param('id') id: string, @Body('status') status: SupportTicketStatus) {
        return this.supportService.updateTicketStatus(id, status);
    }
}
