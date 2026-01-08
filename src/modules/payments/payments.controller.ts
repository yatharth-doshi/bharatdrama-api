import { Controller, Get, Post, Put, Param, Body, UseGuards, Inject, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('payments')
export class PaymentsController {
    constructor(@Inject(PaymentsService) private paymentsService: PaymentsService) { }

    @Post('initiate/:subscriptionId')
    @UseGuards(JwtGuard)
    async initiatePayment(
        @CurrentUser() user: any,
        @Param('subscriptionId') subscriptionId: string,
        @Body() body: { paymentMethod: string },
    ) {
        return this.paymentsService.initiatePayment(user.id, subscriptionId, body.paymentMethod);
    }

    @Post('verify/:paymentId')
    @UseGuards(JwtGuard)
    async verifyPayment(@Param('paymentId') paymentId: string, @Body() body: { transactionId: string }) {
        return this.paymentsService.verifyPayment(paymentId, body.transactionId);
    }

    @Get('history')
    @UseGuards(JwtGuard)
    async getPaymentHistory(
        @CurrentUser() user: any,
        @Query('skip') skip?: string,
        @Query('take') take?: string,
    ) {
        return this.paymentsService.getPaymentHistory(user.id, parseInt(skip || '0'), parseInt(take || '10'));
    }

    @Put(':id/refund')
    @UseGuards(JwtGuard)
    async refundPayment(@Param('id') paymentId: string) {
        return this.paymentsService.refundPayment(paymentId);
    }
}
