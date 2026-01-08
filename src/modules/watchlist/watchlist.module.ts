import { Module } from '@nestjs/common';
import { WatchlistController } from './watchlist.controller.js';
import { WatchlistService } from './watchlist.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
    imports: [PrismaModule],
    controllers: [WatchlistController],
    providers: [WatchlistService],
    exports: [WatchlistService],
})
export class WatchlistModule { }
