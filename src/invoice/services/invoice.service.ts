import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Invoice } from '../entities/invoice.entity';
import { CachingService } from 'src/cache/caching';
import { UsersService } from 'src/users/services/users.service';
import { BooksService } from 'src/books/services/books.service';
import { CreateInvoiceDto } from './../../dto/invoicedto/createinvoice.dto';
import { InvoiceResponseDto} from './../../dto/invoicedto/invoiceresponse.dto';
import { calculator } from 'src/bussiness/calculator';
@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,
        private readonly cachingserice: CachingService,
        private readonly userService: UsersService,
        private readonly bookService: BooksService
    ){}
    async getAll(): Promise<InvoiceResponseDto[]>{
        const cacheKey = 'invoices:all';

        // Kiểm tra cache trước
        const cached = await this.cachingserice.get(cacheKey);
        if (cached) {
            console.log('Trả dữ liệu từ Redis cache');
            return cached;
        }

        const invoices = await this.invoiceRepository
        .createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.user', 'user')
        .leftJoinAndSelect('invoice.details', 'details')
        .select([
            'invoice.InvoiceId',
            'invoice.InvoiceDate',
            'user.UserId',
            'user.Fullname',
            'details', // hoặc chỉ chọn một số fields từ `details` nếu muốn
        ]).getMany();
        
        const result = plainToInstance(InvoiceResponseDto, invoices);
        
        await this.cachingserice.set(cacheKey, result , 60); // TTL: 60 giây
        return result;
    }
    
    async findOne(InvoiceId: number): Promise<InvoiceResponseDto|null> {
        const invoice = await this.invoiceRepository
        .createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.user', 'user')
        .leftJoinAndSelect('invoice.details', 'details')
        .select([
            'invoice.InvoiceId',
            'invoice.InvoiceDate',
            'user.UserId',
            'user.Fullname',
            'details', // hoặc chỉ chọn một số fields từ `details` nếu muốn
        ]).where('invoice.InvoiceId = :InvoiceId', { InvoiceId }).getOne();

        if (!invoice) {
            throw new NotFoundException(`Không tìm thấy hóa đơn với ID ${InvoiceId}`);
        }

        const result = plainToInstance(InvoiceResponseDto, invoice);
        return result;
    }

    async ReduceBook(createInvoiceDto: CreateInvoiceDto){
        for (const item of createInvoiceDto.Details) {
            const book = await this.bookService.findOne(item.BookId);

            if (!book) {
                throw new NotFoundException(`Product with id ${item.BookId} not found`);
            }

            if (book.Stock < item.Quantity) {
                throw new BadRequestException(
                    `Số lượng sách của bạn yêu cầu không đủ để cung cấp`,
                );
            }

            book.Stock = calculator.ReduceBook(book.Stock, item.Quantity);
            await this.bookService.update(book.BookId, book);
        }
    }

    Total(createInvoiceDto: CreateInvoiceDto): number {
        let totalAmount = 0;
        for (const item of createInvoiceDto.Details) {
            totalAmount += item.Quantity * item.UnitPrice;
        }
        return totalAmount;
    }



    
    async create(createInvoiceDto: CreateInvoiceDto): Promise<InvoiceResponseDto> {
        const user = await this.userService.findOne(createInvoiceDto.UserId );

        if (!user) throw new NotFoundException('User not found');

        await this.ReduceBook(createInvoiceDto);

        const invoice = this.invoiceRepository.create({
            UserId: user.UserId,
            InvoiceDate: createInvoiceDto.InvoiceDate,
            details: createInvoiceDto.Details, // nếu dùng cascade
            Total: this.Total(createInvoiceDto)
        });

        const saved = await this.invoiceRepository.save(invoice);

        const res = plainToInstance(InvoiceResponseDto, {
            InvoiceId: saved.InvoiceId,
            UserId: saved.UserId,
            UserName: user.UserName,
            Fullname: user.Fullname,
            InvoiceDate: saved.InvoiceDate,
            Details: saved.details,
            Total: saved.Total 
        })    
        return res;
    }
}
