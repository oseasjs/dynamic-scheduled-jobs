import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LogJob } from "./log.job.entity";
import { LogJobService } from "./log.job.service";

@Module({
    imports: [
      TypeOrmModule.forFeature([LogJob])
    ],
    controllers: [],
    providers: [
      LogJobService
    ],
    exports: [
        LogJobService
    ]
})


export class LogJobModule {}