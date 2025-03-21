import { Test, TestingModule } from '@nestjs/testing';
import { BorrowRecordsController } from './borrow-records.controller';

describe('BorrowRecordsController', () => {
  let controller: BorrowRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowRecordsController],
    }).compile();

    controller = module.get<BorrowRecordsController>(BorrowRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
