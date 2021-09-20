import { Test, TestingModule } from '@nestjs/testing';
import { BullJobConsumerService } from './bull.job.consumer.service';

describe('BullJobConsumerService', () => {
  let service: BullJobConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BullJobConsumerService],
    }).compile();

    service = module.get<BullJobConsumerService>(BullJobConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
