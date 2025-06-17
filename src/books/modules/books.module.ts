import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from '../entities/books.entity';
import { CachingService } from '../../cache/caching';
import { BooksService } from '../services/books.service';
import { BooksController } from '../controllers/books.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Books])],
  controllers: [BooksController],
  providers: [BooksService, CachingService],
  exports: [BooksService]
})
export class BooksModule {}
