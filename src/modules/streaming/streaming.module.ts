import { Module } from '@nestjs/common';
import { StreamingService } from './streaming.service.js';
import { StreamingController } from './streaming.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

import { UserTasteProfileModule } from '../user-taste-profile/user-taste-profile.module.js';

@Module({
    imports: [PrismaModule, UserTasteProfileModule],
    providers: [StreamingService],
    controllers: [StreamingController],
    exports: [StreamingService],
})
export class StreamingModule { }
