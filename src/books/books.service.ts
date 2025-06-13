import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Books } from './books.entity';
import { NotFoundException } from '@nestjs/common';
import { CachingService } from './books_caching';
import { Workbook } from 'exceljs';
import { Response } from 'express';
import * as XLSX from 'xlsx';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Books)
        private readonly booksRepository: Repository<Books>,
        private readonly cachingservice: CachingService
    ){}
    
    async getAll(): Promise<Books[]>{
        const cacheKey = 'users:all';

        // Kiểm tra cache trước
        const cached = await this.cachingservice.get(cacheKey);
        if (cached) {
            console.log('Trả dữ liệu từ Redis cache');
            return cached;
        }
        const books = await this.booksRepository.find();
        await this.cachingservice.set(cacheKey, books , 60);
        return books;
    }
    
    async findOne(BookId: number): Promise<Books|null> {
        return this.booksRepository.findOne({ where: { BookId } });
    }
    
    create(Book: Partial<Books>): Promise<Books> {  //Partial là tạo ra 1 object nơi các thuôc tính nó đã tồn tại
        return this.booksRepository.save(Book);
    }
    
    async update(BookId: number, UpdateBook: Partial<Books>): Promise<Books> {  //Partial là tạo ra 1 object nơi các thuôc tính nó đã tồn tại
        const existingUser = await this.booksRepository.findOne({ where: { BookId } });      
        if (!existingUser) {
            throw new NotFoundException(`User with id ${BookId} not found`);
        }

        const new_book = this.booksRepository.merge(existingUser, UpdateBook);
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


    async importUsersFromExcel(filePath: string): Promise<{ inserted: number }> {
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
