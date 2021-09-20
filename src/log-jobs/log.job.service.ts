import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobDto } from 'src/dtos/job.dto';
import { Repository } from 'typeorm';
import { LogJob } from './log.job.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LogJobService {

    private logger = new Logger('LogJobService');

    constructor(
        @InjectRepository(LogJob) private repository: Repository<LogJob>) {}

    async save(dto: JobDto, executedBy: string) : Promise<LogJob> {

        const logJob = plainToClass(LogJob, dto);
        logJob.executedBy = executedBy;
        logJob.executedAt = new Date();

        return await this.repository
            .save(logJob)
            .then((log) => {
                this.logger.log(`JOB [${log.jobId}] from [${log.executedBy}] EXECUTION LOGGED on DB`);
                return log;
            });

    }

}
