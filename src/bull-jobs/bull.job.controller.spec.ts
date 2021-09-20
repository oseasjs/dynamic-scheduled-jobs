import { Test, TestingModule } from '@nestjs/testing';
import { BullJobController } from './bull.job.controller';

describe('BullJobController', () => {
  let controller: BullJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BullJobController],
    }).compile();

    controller = module.get<BullJobController>(BullJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
