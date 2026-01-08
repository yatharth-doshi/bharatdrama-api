import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config.js';
import databaseConfig from './config/database.config.js';
import authConfig from './config/auth.config.js';
import awsConfig from './config/aws.config.js';
import paymentConfig from './config/payment.config.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { ProfilesModule } from './modules/profiles/profiles.module.js';
import { ContentModule } from './modules/content/content.module.js';
import { StreamingModule } from './modules/streaming/streaming.module.js';
import { WatchHistoryModule } from './modules/watch-history/watch-history.module.js';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { WatchlistModule } from './modules/watchlist/watchlist.module.js';
import { SearchHistoryModule } from './modules/search-history/search-history.module.js';
import { UserTasteProfileModule } from './modules/user-taste-profile/user-taste-profile.module.js';
import { SupportModule } from './modules/support/support.module.js';
import { RecommendationModule } from './modules/recommendation/recommendation.module.js';
import { PromotionModule } from './modules/promotion/promotion.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, awsConfig, paymentConfig],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    ContentModule,
    StreamingModule,
    WatchHistoryModule,
    SubscriptionsModule,
    PaymentsModule,
    NotificationsModule,
    AdminModule,
    WatchlistModule,
    SearchHistoryModule,
    UserTasteProfileModule,
    SupportModule,
    RecommendationModule,
    PromotionModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: 'APP_PIPE',
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule { }
