import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service.js';
import { SubscriptionsController } from './subscriptions.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
    imports: [PrismaModule],
    providers: [SubscriptionsService],
    controllers: [SubscriptionsController],
    exports: [SubscriptionsService],
})
export class SubscriptionsModule { }
