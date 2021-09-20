import { Body, Controller, Delete, Param, ParseBoolPipe, Patch, Post } from '@nestjs/common';
import { JobDto } from 'src/dtos/job.dto';
import { BullJobProducerService } from './bull.job.producer.service';

@Controller('bull/jobs')
export class BullJobController {

    constructor(private producerService: BullJobProducerService) {}

    @Post()
    async createJob(@Body() dto: JobDto): Promise<JobDto> {
        return await this.producerService.createJob(dto);
    }

    @Delete('/:jobId') 
    async deleteDynamicJob(
        @Param('jobId') jobId: string): Promise<void> {
        await this.producerService.deleteJob(jobId);
    }

    @Post('/toogle/:enable') 
    async toogleQueue(
        @Param('enable', ParseBoolPipe) enable: boolean): Promise<void> {
        await this.producerService.toogleQueue(enable);
    }

}
