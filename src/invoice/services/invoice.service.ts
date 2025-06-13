import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { CachingService } from '../cache/invoice_caching';
@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,
        private readonly cachingserice: CachingService
    ){}
    async getAll(): Promise<Invoice[]>{
        const cacheKey = 'users:all';

        // Kiểm tra cache trước
        const cached = await this.cachingserice.get(cacheKey);
        if (cached) {
            console.log('Trả dữ liệu từ Redis cache');
            return cached;
        }
        const invoices = await this.invoiceRepository.find();
        await this.cachingserice.set(cacheKey, invoices , 60); // TTL: 60 giây
        return invoices;
    }
    
    async findOne(InvoiceId: number): Promise<Invoice|null> {
        return this.invoiceRepository.findOne({ where: { InvoiceId } });
    }
    create(invoice: Partial<Invoice>): Promise<Invoice> {  //Partial là tạo ra 1 object nơi các thuôc tính nó đã tồn tại
        return this.invoiceRepository.save(invoice);
    }

}
