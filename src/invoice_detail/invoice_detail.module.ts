import { Module } from '@nestjs/common';
import { InvoiceDetailService } from './invoice_detail.service';
import { InvoiceDetailController } from './invoice_detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice_Detail } from './invoice_detail.entity';
import { CachingService } from './invoicedetail_caching';
@Module({
  imports: [TypeOrmModule.forFeature([Invoice_Detail])],
  providers: [InvoiceDetailService, CachingService],
  controllers: [InvoiceDetailController]
})
export class InvoiceDetailModule {}
