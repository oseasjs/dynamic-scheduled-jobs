import { Module } from '@nestjs/common';
import { LogJobModule } from 'src/log-jobs/log.job.module';
import { CronJobController } from './cron.job.controller';
import { CronJobService } from './cron.job.service';

@Module({
  imports: [LogJobModule],
  controllers: [CronJobController],
  providers: [CronJobService]
})
export class CronJobModule {}
