import { Module } from '@nestjs/common';
import { BooksController } from '../controllers/books.controller';
import { ExportController } from '../controllers/books_export.controller';
import { ImportController } from '../controllers/books_import.controller';
import { BooksService } from '../services/books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from '../entities/books.entity';
import { CachingService } from '../cache/books_caching';
@Module({
  imports: [TypeOrmModule.forFeature([Books])],
  controllers: [BooksController, ExportController, ImportController],
  providers: [BooksService, CachingService]
})
export class BooksModule {}
