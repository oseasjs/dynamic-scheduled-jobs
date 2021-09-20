import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { JobDto } from 'src/dtos/job.dto';
import { JobTypeEnum } from 'src/enums/job.type.enum';
import { QueueEnum } from 'src/enums/queue.enum';

@Injectable()
export class BullJobProducerService {

    private logger = new Logger('BullJobProducerService');

    constructor(@InjectQueue(QueueEnum.JOB_QUEUE_NAME.toString()) private queue: Queue) {}

    async onModuleInit() {
        this.createJob(this.mockJobDto());
    }

    async createJob(dto: JobDto) : Promise<JobDto> {

        const jobId = this.jobId(dto.clientId, dto.jobType);
        if (await this.isJobExists(jobId)) {
            this.logger.warn(`QUEUE Job [${jobId}] ALREADY EXISTS on REDIS`);
        }
        else {
            const job = await this.createBullJob(dto);
            this.logger.warn(`QUEUE Job [${dto.jobId}] CREATED according cron definition: ${dto.cron}`);
        }
        
        return dto;

    }
    
    async deleteJob(jobId: string) : Promise<void> {

        const repeatableJobs = await this.queue.getRepeatableJobs();
        repeatableJobs
            .filter(job => job.id === jobId)
            .forEach(async job => {
                await this.queue.removeRepeatableByKey(job.key);
                this.logger.warn(`QUEUE Job [${jobId}] REMOVED from REDIS`);
            });

    }

    async toogleQueue(enable: boolean) : Promise<void> {
        this.logger.warn(`toogleQueue [${enable}] REDIS queue`);
        enable ? 
            await this.queue.resume().then(() => this.logger.warn(`Redis Queue RESUMED`))
            :
            await this.queue.pause().then(() => this.logger.warn(`Redis Queue PAUSED`));;
        
    }

    private async createBullJob(dto: JobDto) : Promise<Job> {
        
        dto.jobId = this.jobId(dto.clientId, dto.jobType);
        dto.appId = process.pid.toString();

        return await this.queue.add(
            dto.jobType.toString(),
            dto,
            {
                jobId: dto.jobId,
                repeat: {
                    cron: dto.cron
                }
            }
        );

    }

    private jobId(clientId: number, jobType: JobTypeEnum) {
        return clientId + '-' + jobType;
    }

    private async isJobExists(jobId: string) : Promise<boolean> {

        const repeatableJobs = await this.queue.getRepeatableJobs();
        return repeatableJobs
            .filter(job => job.id === jobId)
            .length > 0;

    }

    private mockJobDto() : JobDto {

        const json : object = {
            "clientId": 1,
            "jobName": "Bull Job to Process Highest Price for client 1",
            "jobType": "PROCESS_HIGHEST_PRICE",
            "cron": "0,10,20,25,30,40,45,50 * * * * *",
            "expectedFail": false,
            "expectedKillInstance": false
        };

        return json as JobDto;

    }
      

}
