import { Test, TestingModule } from '@nestjs/testing';
import { BullJobProducerService } from './bull.job.producer.service';

describe('BullJobProducerService', () => {
  let service: BullJobProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BullJobProducerService],
    }).compile();

    service = module.get<BullJobProducerService>(BullJobProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
