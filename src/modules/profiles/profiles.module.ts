import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service.js';
import { ProfilesController } from './profiles.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
    imports: [PrismaModule],
    providers: [ProfilesService],
    controllers: [ProfilesController],
    exports: [ProfilesService],
})
export class ProfilesModule { }
