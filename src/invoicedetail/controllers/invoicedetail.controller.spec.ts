import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceDetailController } from './invoicedetail.controller';

describe('InvoiceDetailController', () => {
  let controller: InvoiceDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceDetailController],
    }).compile();

    controller = module.get<InvoiceDetailController>(InvoiceDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
