import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice_Detail } from '../entites/invoicedetail.entity';
import { CachingService } from '../cache/invoicedetail.caching';
import { InvoiceDetailService } from '../services/invoicedetail.service';
import { InvoiceDetailController } from '../controllers/invoicedetail.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Invoice_Detail])],
  providers: [InvoiceDetailService, CachingService],
  controllers: [InvoiceDetailController]
})
export class InvoiceDetailModule {}
