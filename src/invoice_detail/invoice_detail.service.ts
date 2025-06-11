import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice_Detail } from './invoice_detail.entity';
import { CachingService } from './invoicedetail_caching';
@Injectable()
export class InvoiceDetailService {
    constructor(
            @InjectRepository(Invoice_Detail)
            private readonly invoice_detailRepository: Repository<Invoice_Detail>,
            private readonly cachingservice: CachingService
        ){}
        async getAll(): Promise<Invoice_Detail[]>{
                // Kiểm tra cache trước
                const cacheKey = 'users:all';
                const cached = await this.cachingservice.get(cacheKey);
                if (cached) {
                        console.log('Trả dữ liệu từ Redis cache');
                        return cached;
                }
                const invoice_detail =  await this.invoice_detailRepository.find();
                await this.cachingservice.set(cacheKey, invoice_detail, 60); // TTL: 60 giây
                return invoice_detail;
        }
        async findOne(InvoiceDetailId: number): Promise<Invoice_Detail|null> {
                return this.invoice_detailRepository.findOne({ where: { InvoiceDetailId } });
        }
    
        create(invoice_detail: Partial<Invoice_Detail>): Promise<Invoice_Detail> {  //Partial là tạo ra 1 object nơi các thuôc tính nó đã tồn tại
                return this.invoice_detailRepository.save(invoice_detail);
        }
}
