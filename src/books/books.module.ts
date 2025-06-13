import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { ExportController } from './books_export.controller';
import { ImportController } from './books_import.controller';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from './books.entity';
import { CachingService } from './books_caching';
@Module({
  imports: [TypeOrmModule.forFeature([Books])],
  controllers: [BooksController, ExportController, ImportController],
  providers: [BooksService, CachingService]
})
export class BooksModule {}
