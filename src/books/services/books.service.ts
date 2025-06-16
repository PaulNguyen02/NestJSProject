import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Books } from '../entities/books.entity';
import { plainToInstance } from 'class-transformer';
import { CachingService } from '../cache/bookscaching';
import { ExportBookDTO, ImportBookDTO } from 'src/dto/bookdto/book.dto';
@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Books)
        private readonly booksRepository: Repository<Books>,
        private readonly cachingservice: CachingService
    ){}
    
    async getAll(): Promise<ExportBookDTO[]>{
        const cacheKey = 'users:all';

        // Kiểm tra cache trước
        const cached = await this.cachingservice.get(cacheKey);
        if (cached) {
            console.log('Trả dữ liệu từ Redis cache');
            return cached;
        }

        const books = await this.booksRepository.find();
        const res = plainToInstance(ExportBookDTO, books, {excludeExtraneousValues: true,})
        await this.cachingservice.set(cacheKey, res , 60);
        return res;
    }
    
    async findOne(BookId: number): Promise<Books|null> {
        return this.booksRepository.findOne({ where: { BookId } });
    }
    
    async create(Book: Partial<ImportBookDTO>): Promise<Books> {  //Partial là tạo ra 1 object nơi các thuôc tính nó đã tồn tại
        const bookEntity = plainToInstance(Books, Book);
        return this.booksRepository.save(bookEntity);
    }
    
    async update(BookId: number, UpdateBook: Partial<ImportBookDTO>): Promise<Books> {  //Partial là tạo ra 1 object nơi các thuôc tính nó đã tồn tại
        const existingUser = await this.booksRepository.findOne({ where: { BookId } });      
        if (!existingUser) {
            throw new NotFoundException(`User with id ${BookId} not found`);
        }

        const newbook = plainToInstance(Books, UpdateBook);

        const new_book = this.booksRepository.merge(existingUser, newbook);
        return await this.booksRepository.save(new_book);
    }
     
    async remove(BookId: number): Promise<void> {
        await this.booksRepository.delete(BookId);
    }

    async exportBooksToExcel(res: Response): Promise<void> {
        const books = await this.getAll();
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Books');
        worksheet.columns = [
        { header: 'BookId', key: 'BookId', width: 10 },
        { header: 'Title', key: 'Title', width: 30 },
        { header: 'Author', key: 'Author', width: 30 },
        { header: 'Stock', key: 'Stock', width: 20 },
        { header: 'Price', key: 'Price', width: 20 }
        ];
        
        books.forEach((book) => {
            worksheet.addRow({
                BookId: book.BookId,
                Title: book.Title,
                Author: book.Author,
                Stock: book.Stock,
                Price: book.Price 
            });
        });

        res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader('Content-Disposition', 'attachment; filename=books.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    }


    async importBooksFromExcel(filePath: string): Promise<{ inserted: number }> {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: any[] = XLSX.utils.sheet_to_json(sheet);        //return Json data

         const books = data.map((row: any) => ({
            Title: row.Title,
            Author: row.Author,
            Price: row.Price,
            Stock: row.Stock
        }));

        const result = await this.booksRepository.save(books);
        return { inserted: result.length };
    }
}
