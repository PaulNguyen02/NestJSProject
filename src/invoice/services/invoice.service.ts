import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Invoice } from '../entities/invoice.entity';
import { CachingService } from '../cache/invoice_caching';
import { UsersService } from 'src/users/services/users.service';
import { CreateInvoiceDto } from './../../dto/invoicedto/createinvoice.dto';
import { InvoiceResponseDto, InvoiceResponseDetailDto } from './../../dto/invoicedto/invoiceresponse.dto';
@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,
        private readonly cachingserice: CachingService,
        private readonly userService: UsersService
    ){}
    async getAll(): Promise<InvoiceResponseDetailDto[]>{
        const cacheKey = 'users:all';

        // Kiểm tra cache trước
        const cached = await this.cachingserice.get(cacheKey);
        if (cached) {
            console.log('Trả dữ liệu từ Redis cache');
            return cached;
        }
        //const invoices = await this.invoiceRepository.find();
        const invoices = await this.invoiceRepository.find({
            relations: ['user', 'details'], // relation đến entity Users và InvoiceDetail
        });
        
        const result = invoices.map((invoice) =>
        plainToInstance(InvoiceResponseDetailDto, {
            InvoiceId: invoice.InvoiceId,
            InvoiceDate: invoice.InvoiceDate,
            UserId: invoice.UserId,
            UserName: invoice.user?.UserName,
            Fullname: invoice.user?.Fullname,
            details: invoice.details.map((d) => ({
            BookId: d.BookId,
            Quantity: d.Quantity,
            UnitPrice: d.UnitPrice,
            })),
        })
        );
        
        await this.cachingserice.set(cacheKey, result , 60); // TTL: 60 giây
        return result;
    }
    
    async findOne(InvoiceId: number): Promise<InvoiceResponseDetailDto|null> {
        const invoice = await this.invoiceRepository.findOne({
            where: { InvoiceId: InvoiceId },
            relations: ['user', 'details'],
        });
        if (!invoice) {
            throw new NotFoundException(`Không tìm thấy hóa đơn với ID ${InvoiceId}`);
        }

        const result = plainToInstance(InvoiceResponseDetailDto, {
            InvoiceId: invoice.InvoiceId,
            InvoiceDate: invoice.InvoiceDate,
            UserId: invoice.UserId,
            UserName: invoice.user?.UserName,
            Fullname: invoice.user?.Fullname,
            details: invoice.details.map((d) => ({
            BookId: d.BookId,
            Quantity: d.Quantity,
            UnitPrice: d.UnitPrice,
            })),
        });

        return result;
    }



    async create(createInvoiceDto: CreateInvoiceDto): Promise<InvoiceResponseDto> {
        const user = await this.userService.findOne(createInvoiceDto.UserId );

        if (!user) throw new NotFoundException('User not found');

        const invoice = this.invoiceRepository.create({
            UserId: user.UserId,
            InvoiceDate: createInvoiceDto.InvoiceDate,
            details: createInvoiceDto.Details, // nếu dùng cascade
        });

        const saved = await this.invoiceRepository.save(invoice);

        return {
            InvoiceId: saved.InvoiceId,
            UserId: saved.UserId,
            UserName: user.UserName,
            Fullname: user.Fullname,
            InvoiceDate: saved.InvoiceDate,
            Details: saved.details,
        };
    }
}
