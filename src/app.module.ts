import { BullModule} from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobModule } from './cron-jobs/cron.job.module';
import { BullJobsModule } from './bull-jobs/bull.job.module';
import { LogJobModule } from './log-jobs/log.job.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.DOCKER_HOST || process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DOCKER_HOST || process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    LogJobModule,
    CronJobModule,
    BullJobsModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
