import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from '../entities/books.entity';
import { CachingService } from '../cache/books_caching';
import { BooksService } from '../services/books.service';
import { BooksController } from '../controllers/books.controller';
import { BooksReportController } from '../controllers/books_report.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Books])],
  controllers: [BooksController, BooksReportController],
  providers: [BooksService, CachingService]
})
export class BooksModule {}
