import { JobTypeEnum } from "src/enums/job.type.enum";

interface JobDto {
    jobId: string;
    clientId: number;
    jobType: JobTypeEnum;
    cron: string;
    expectedFail: boolean;
    expectedKillInstance: boolean;
    appId: string;
}

export {JobDto};