import { Module } from '@nestjs/common';
import { UserTasteProfileController } from './user-taste-profile.controller.js';
import { UserTasteProfileService } from './user-taste-profile.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
    imports: [PrismaModule],
    controllers: [UserTasteProfileController],
    providers: [UserTasteProfileService],
    exports: [UserTasteProfileService],
})
export class UserTasteProfileModule { }
