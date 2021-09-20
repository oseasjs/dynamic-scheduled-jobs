import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MiddlewareBuilder } from '@nestjs/core';
import { Queue } from 'bull';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';
import { BullJobProducerService } from './bull.job.producer.service';
import { BullJobController } from './bull.job.controller';
import { BullJobConsumerService } from './bull.job.consumer.service';
import { QueueEnum } from 'src/enums/queue.enum';
import { LogJobModule } from 'src/log-jobs/log.job.module';

@Module({
    imports: [
        BullModule.registerQueue(
            {
                name: QueueEnum.JOB_QUEUE_NAME.toString(),
            }
        ),
        LogJobModule
    ],
    controllers: [BullJobController],
    providers: [BullJobProducerService, BullJobConsumerService]
})

export class BullJobsModule {

    constructor(
        @InjectQueue(QueueEnum.JOB_QUEUE_NAME.toString()) private jobQueue: Queue) {}
      
      configure(consumer: MiddlewareBuilder) {
        const {router} = createBullBoard([
          new BullAdapter(this.jobQueue)
        ]);
        consumer.apply(router).forRoutes("/admin/bull");
      }

}
