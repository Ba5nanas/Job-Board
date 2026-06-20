import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ThrottlerModule } from '@nestjs/throttler'
import { CacheModule } from '@nestjs/cache-manager'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { BackofficeModule } from './backoffice/backoffice.module'
import { CompaniesModule } from './companies/companies.module'
import { JobsModule } from './jobs/jobs.module'
import { ApplicationsModule } from './applications/applications.module'
import { CategoriesModule } from './categories/categories.module'
import { ActivityLogsModule } from './activity-logs/activity-logs.module'
import { ResumeModule } from './resume/resume.module'
import { NotificationsModule } from './notifications/notifications.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { PrismaModule } from './prisma/prisma.module'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),

    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.THROTTLE_TTL) || 60,
        limit: Number(process.env.THROTTLE_LIMIT) || 100,
      },
    ]),

    CacheModule.register({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryAttempts: 5,
        retryDelay: 1000,
      }),
      inject: [ConfigService],
    }),

    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    BackofficeModule,
    CompaniesModule,
    JobsModule,
    ApplicationsModule,
    CategoriesModule,
    ActivityLogsModule,
    ResumeModule,
    NotificationsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
