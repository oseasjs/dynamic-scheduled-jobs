import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { JobDto } from 'src/dtos/job.dto';
import { CronJobService } from './cron.job.service';

@Controller('/cron/jobs')
export class CronJobController {

    constructor(private service: CronJobService) {}

    @Post()
    async createJob(@Body() dto: JobDto): Promise<JobDto> {
        return await this.service.createJob(dto);
    }

    @Delete('/:jobId')
    async deleteJob(
        @Param('jobId') jobId: string): Promise<void> {
        await this.service.deleteJob(jobId);
    }

}