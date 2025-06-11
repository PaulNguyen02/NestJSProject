import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { ExportController } from './books_export.controller';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from './books.entity';
import { CachingService } from './books_caching';
@Module({
  imports: [TypeOrmModule.forFeature([Books])],
  controllers: [BooksController, ExportController],
  providers: [BooksService, CachingService]
})
export class BooksModule {}
