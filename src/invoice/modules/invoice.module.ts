import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from '../entities/invoice.entity';
import { CachingService } from '../cache/invoicecaching'; 
import { InvoiceService } from '../services/invoice.service';
import { UsersModule } from 'src/users/modules/users.module';
import { InvoiceController } from '../controllers/invoice.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Invoice]), UsersModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, CachingService]
})
export class InvoiceModule {}
