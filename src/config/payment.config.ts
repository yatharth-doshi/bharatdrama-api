import { registerAs } from '@nestjs/config';

export default registerAs('payment', () => ({
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        keySecret: process.env.RAZORPAY_KEY_SECRET,
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    upi: {
        enabled: process.env.UPI_ENABLED === 'true',
        apiKey: process.env.UPI_API_KEY,
    },
}));
