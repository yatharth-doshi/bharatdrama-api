import { Module } from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service.js';
import { WatchHistoryController } from './watch-history.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
    imports: [PrismaModule],
    providers: [WatchHistoryService],
    controllers: [WatchHistoryController],
    exports: [WatchHistoryService],
})
export class WatchHistoryModule { }
