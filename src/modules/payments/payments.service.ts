import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
    constructor(
        @Inject(PrismaService) private prisma: PrismaService,
        @Inject(ConfigService) private configService: ConfigService,
    ) { }

    async initiatePayment(userId: string, subscriptionId: string, paymentMethod: string) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: subscriptionId },
            include: { plan: true },
        });

        if (!subscription) throw new NotFoundException('Subscription not found');

        const amount = subscription.plan.monthlyPrice; // or yearly based on subscription

        const payment = await this.prisma.payment.create({
            data: {
                userId,
                subscriptionId,
                amount,
                paymentMethod,
                status: 'PENDING',
            },
        });

        // Here you would integrate with actual payment gateway (Razorpay/Stripe/UPI)
        const paymentGatewayResponse = this.integrateWithPaymentGateway(payment, paymentMethod);

        return {
            message: 'Payment initiated',
            data: {
                paymentId: payment.id,
                amount,
                currency: payment.currency,
                ...paymentGatewayResponse,
            },
        };
    }

    async verifyPayment(paymentId: string, transactionId: string) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
        });

        if (!payment) throw new NotFoundException('Payment not found');

        // Verify with payment gateway
        const isValid = this.verifyWithPaymentGateway(transactionId);

        if (isValid) {
            const updatedPayment = await this.prisma.payment.update({
                where: { id: paymentId },
                data: {
                    status: 'COMPLETED',
                    transactionId,
                },
            });

            // Activate subscription
            await this.prisma.subscription.update({
                where: { id: payment.subscriptionId },
                data: { status: 'ACTIVE' },
            });

            return { message: 'Payment verified and subscription activated', data: updatedPayment };
        } else {
            await this.prisma.payment.update({
                where: { id: paymentId },
                data: {
                    status: 'FAILED',
                    failureReason: 'Verification failed',
                },
            });

            throw new BadRequestException('Payment verification failed');
        }
    }

    async getPaymentHistory(userId: string, skip = 0, take = 10) {
        const [payments, total] = await Promise.all([
            this.prisma.payment.findMany({
                where: { userId },
                include: { subscription: { select: { plan: true } } },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.payment.count({ where: { userId } }),
        ]);

        return { message: 'Payment history retrieved', data: payments, pagination: { total, skip, take } };
    }

    async refundPayment(paymentId: string) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
        });

        if (!payment) throw new NotFoundException('Payment not found');
        if (payment.status !== 'COMPLETED') throw new BadRequestException('Can only refund completed payments');

        const refundedPayment = await this.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: 'REFUNDED',
                refundAmount: payment.amount,
                refundDate: new Date(),
            },
        });

        // Cancel subscription
        await this.prisma.subscription.update({
            where: { id: payment.subscriptionId },
            data: { status: 'CANCELLED' },
        });

        return { message: 'Payment refunded', data: refundedPayment };
    }

    private integrateWithPaymentGateway(payment: any, paymentMethod: string) {
        // This would integrate with Razorpay, Stripe, or UPI APIs
        return {
            orderId: `ORD-${Date.now()}`,
            redirectUrl: `https://payment-gateway.com/pay/${payment.id}`,
        };
    }

    private verifyWithPaymentGateway(transactionId: string): boolean {
        // This would verify with actual payment gateway
        return true;
    }
}
