import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        @Inject(PrismaService) private prisma: PrismaService,
        @Inject(ConfigService) private configService: ConfigService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, phone, firstName, lastName, password } = registerDto;

        // Check if user already exists
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email }, ...(phone ? [{ phone }] : [])],
            },
        });

        if (existingUser) {
            throw new BadRequestException('User with this email or phone already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email,
                phone,
                firstName,
                lastName,
                passwordHash: hashedPassword,
            },
        });

        // Generate tokens
        const tokens = this.generateTokens(user);

        return {
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            ...tokens,
        };
    }

    async login(loginDto: LoginDto) {
        const { email, phone, password } = loginDto;

        // Find user
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    ...(email ? [{ email }] : []),
                    ...(phone ? [{ phone }] : []),
                ],
            },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check if account is active
        if (!user.isActive || user.isBlocked) {
            throw new UnauthorizedException('Account is inactive or blocked');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash || '');
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Update last login
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                lastLogin: new Date(),
                loginCount: { increment: 1 },
            },
        });

        // Generate tokens
        const tokens = this.generateTokens(user);

        return {
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            ...tokens,
        };
    }

    async refreshToken(refreshToken: string) {
        try {
            const secret = this.configService.get('auth.jwt.refreshSecret');
            const decoded: any = jwt.verify(refreshToken, secret);

            const user = await this.prisma.user.findUnique({
                where: { id: decoded.id },
            });

            if (!user || !user.isActive || user.isBlocked) {
                throw new UnauthorizedException('Invalid token');
            }

            const tokens = this.generateTokens(user);

            return {
                message: 'Token refreshed successfully',
                ...tokens,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    private generateTokens(user: any) {
        const jwtSecret = this.configService.get('auth.jwt.secret');
        const jwtExpiration = this.configService.get('auth.jwt.expirationTime');
        const refreshSecret = this.configService.get('auth.jwt.refreshSecret');
        const refreshExpiration = this.configService.get('auth.jwt.refreshExpirationTime');

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = jwt.sign(payload, jwtSecret, {
            expiresIn: jwtExpiration,
        });

        const refreshTokenValue = jwt.sign(payload, refreshSecret, {
            expiresIn: refreshExpiration,
        });

        return {
            accessToken,
            refreshToken: refreshTokenValue,
            tokenType: 'Bearer',
        };
    }

    async validateToken(token: string) {
        try {
            const secret = this.configService.get('auth.jwt.secret');
            const decoded = jwt.verify(token, secret);
            return decoded;
        } catch (error) {
            return null;
        }
    }
}
