import { Test, TestingModule } from '@nestjs/testing';
import { PartitionController } from './partition.controller';
import { PartitionService } from './partition.service';

describe('PartitionController', () => {
  let controller: PartitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartitionController],
      providers: [PartitionService],
    }).compile();

    controller = module.get<PartitionController>(PartitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
