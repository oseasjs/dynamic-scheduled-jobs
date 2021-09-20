import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { JobDto } from 'src/dtos/job.dto';
import { JobTypeEnum } from 'src/enums/job.type.enum';
import { LogJobService } from 'src/log-jobs/log.job.service';

@Injectable()
export class CronJobService {

    private logger = new Logger('CronJobService');

    constructor(
        private logJobService: LogJobService,
        private schedulerRegistry: SchedulerRegistry,) {}

    async onModuleInit() {
        this.createJob(this.mockJobDto());
    }

    async createJob(dto: JobDto) : Promise<JobDto> {

        dto.jobId = this.jobId(dto.clientId, dto.jobType);
        await this.createScheduleJob(dto);
        
        return dto;

    }

    async deleteJob(jobId: string) : Promise<void> {

        if (this.schedulerRegistry.doesExists('cron', jobId)) {
            this.schedulerRegistry.deleteCronJob(jobId);
            this.logger.verbose(`CRON Job [${jobId}] DELETED!`);
        }

    }

    private async createScheduleJob(dto: JobDto) : Promise<void>{

        // Delete job if exists, to avoid error related to job duplicity
        if (this.schedulerRegistry.doesExists('cron', dto.jobId)) {
            this.deleteJob(dto.jobId);
        }

        const job = new CronJob(dto.cron, async () => {
            dto.appId = process.pid.toString();
            await this.logJobService.save(dto, 'cron'); 
            this.logger.verbose(`CRON Job [${dto.jobId}] EXECUTED!`);
        });

        this.schedulerRegistry.addCronJob(dto.jobId, job);
        job.start();
        this.logger.verbose(`CRON Job [${dto.jobId}] CREATED according cron definition: ${dto.cron}`);
    
    }

    private jobId(clientId: number, jobType: JobTypeEnum) {
        return clientId + '-' + jobType;
    }

    private mockJobDto() : JobDto {

        const json : object = {
            "clientId": 1,
            "jobName": "CRON Job to Process Highest Price for client 1",
            "jobType": "PROCESS_HIGHEST_PRICE",
            "cron": "0,5,15,25,35,45,55 * * * * *",
            "expectedFail": false,
            "expectedKillInstance": false
        };

        return json as JobDto;

    }

}
