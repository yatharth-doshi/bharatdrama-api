import { Module } from '@nestjs/common';
import { SearchHistoryController } from './search-history.controller.js';
import { SearchHistoryService } from './search-history.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
    imports: [PrismaModule],
    controllers: [SearchHistoryController],
    providers: [SearchHistoryService],
    exports: [SearchHistoryService],
})
export class SearchHistoryModule { }
