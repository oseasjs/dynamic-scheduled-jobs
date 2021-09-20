import { OnQueueActive, OnQueueCleaned, OnQueueCompleted, OnQueueDrained, OnQueueError, OnQueueFailed, OnQueuePaused, OnQueueProgress, OnQueueRemoved, OnQueueResumed, OnQueueStalled, OnQueueWaiting, Process, Processor } from '@nestjs/bull';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { JobDto } from 'src/dtos/job.dto';
import { JobTypeEnum } from 'src/enums/job.type.enum';
import { QueueEnum } from 'src/enums/queue.enum';
import { LogJob } from 'src/log-jobs/log.job.entity';
import { LogJobService } from 'src/log-jobs/log.job.service';

@Processor(QueueEnum.JOB_QUEUE_NAME.toString())
export class BullJobConsumerService {

    private logger = new Logger('BullJobConsumerService');

    constructor(private logJobService: LogJobService) {}

    @OnQueueError()
    async onError(job: Job) {
        console.log(`BULL EVENT: onError`);
    }

    @OnQueueWaiting()
    async onWaiting(job: Job) {
        console.log(`BULL EVENT: onWaiting`);
    }

    @OnQueueActive()
    async onActive(job: Job) {
        console.log(`BULL EVENT: onActive`);
    }

    @OnQueueProgress()
    async onProcess(job: Job) {
        console.log(`BULL EVENT: onProcess`);
    }

    @OnQueueStalled()
    async onStalled(job: Job) {
        console.log(`BULL EVENT: onStalled`);
    }

    @OnQueueProgress()
    async onQueueProgress(job: Job) {
        console.log(`BULL EVENT: onQueueProgress`);
    }

    @OnQueueCompleted()
    async onQueueCompleted(job: Job) {
        console.log(`BULL EVENT: onQueueCompleted`);
    }

    @OnQueueFailed()
    async onQueueFailed(job: Job) {
        console.log(`BULL EVENT: onQueueFailed`);
    }

    @OnQueuePaused()
    async onQueuePaused(job: Job) {
        console.log(`BULL EVENT: onQueuePaused`);
    }

    @OnQueueResumed()
    async onQueueResumed(job: Job) {
        console.log(`BULL EVENT: onQueueResumed`);
    }

    @OnQueueCleaned()
    async onQueueCleaned(job: Job) {
        console.log(`BULL EVENT: onQueueCleaned`);
    }

    @OnQueueDrained()
    async onQueueDrained(job: Job) {
        console.log(`BULL EVENT: onQueueDrained`);
    }

    @OnQueueRemoved()
    async onQueueRemoved(job: Job) {
        console.log(`BULL EVENT: onQueueRemoved`);
    }

    @Process(JobTypeEnum[JobTypeEnum.PROCESS_HIGHEST_PRICE].toString())
    async processHighestPrice(job: Job<JobDto>) {

        this.logger.warn(`BULL Job [${job.data.jobId}] EXECUTED!`);
        const logJob = await this.logJobService.save(job.data, 'bull');

        await this.expectedFailOrKillInstance(logJob);

        return {};
    }

    @Process(JobTypeEnum[JobTypeEnum.PROCESS_LOWEST_PRICE].toString())
    async processLowestPrice(job: Job<JobDto>) {
        
        this.logger.warn(`BULL Job [${job.data.jobId}] EXECUTED!`);
        const logJob = await this.logJobService.save(job.data, 'bull');
        
        await this.expectedFailOrKillInstance(logJob);

        return {};
    }

    /**
     * Bull Events Sequence according scenarios
     * - Processing successful: 
     * onWaiting => onActive => onQueueCompleted => onQueueDrained
     * 
     * - Processing with error: 
     * onWaiting => onActive => onQueueFailed => onQueueDrained
     * 
     * - Processing with instance kill: 
     * onActive => onQueueCompleted => onQueueDrained => onStalled
     * 
     * @param logJob 
     */

    private async expectedFailOrKillInstance(logJob: LogJob) {

        const myLogger = this.logger;

        if (logJob.expectedKillInstance && logJob.appId === process.pid.toString()) {

            myLogger.warn(`FORCING INSTANCE KILL AFTER 7 SECONDS`);
            await this.delayAndForceError(7000, 'INSTANCE KILLED', true);

        }
        else if (logJob.expectedFail) {

            myLogger.warn(`FORCING ERROR AFTER 3 SECONDS`);
            await this.delayAndForceError(3000, 'FORCED ERROR', false);

        }
        else {
            myLogger.log(`ALL GOOD, no forced error expected!!!`);
        }

    }

    private async delayAndForceError(miliseconds: number, errorMessage: string, killInstance: boolean) : Promise<void> {

        await new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(errorMessage);
            }, miliseconds);
        })
        .catch(error => {
            this.logger.error(error);

            if (killInstance) {
                process.kill(process.pid);
            }
            else {
                throw new Error(error); 
            }
            
        });

    }

}
