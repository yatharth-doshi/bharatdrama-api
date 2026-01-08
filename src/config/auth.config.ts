import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        expirationTime: process.env.JWT_EXPIRATION || '7d',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
        refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION || '30d',
    },
    otp: {
        expirationTime: parseInt(process.env.OTP_EXPIRATION || '600', 10), // 10 minutes
        maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10),
    },
    socialAuth: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        facebook: {
            appId: process.env.FACEBOOK_APP_ID,
            appSecret: process.env.FACEBOOK_APP_SECRET,
        },
    },
}));
