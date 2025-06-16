import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice_Detail } from '../entites/invoicedetail.entity';
import { CachingService } from '../cache/invoicedetail_caching';
import { InvoiceDetailService } from '../services/invoice_detail.service';
import { InvoiceDetailController } from '../controllers/invoice_detail.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Invoice_Detail])],
  providers: [InvoiceDetailService, CachingService],
  controllers: [InvoiceDetailController]
})
export class InvoiceDetailModule {}
