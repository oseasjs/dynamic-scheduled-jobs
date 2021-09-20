import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Table } from "typeorm";

@Entity('log_job')
export class LogJob extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({name: 'job_id'})
    jobId: string;
    
    @Column()
    cron: string;

    @Column({name: 'app_id'})
    appId: string;
  
    @Column({name: 'executed_by'})
    executedBy: string;
    
    @Column({name: 'expected_fail'})
    expectedFail: boolean;

    @Column({name: 'expected_kill_instance'})
    expectedKillInstance: boolean;

    @Column({name: 'executed_at'})
    executedAt: Date;
    
    @CreateDateColumn({ name: 'created_at' }) createdAt: Date;  

}