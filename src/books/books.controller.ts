import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Res,
    Put,
    Delete, 
    ParseIntPipe
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Books } from './books.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CheckStringPipe } from './checking_pipe';
import { Response } from 'express';

@ApiTags('/v1/books')
@Controller('/v1/books')
export class BooksController {
    constructor(private readonly bookService: BooksService) {}
    @Get()
    @ApiOperation({ summary: 'Get All Books' })
    findAll(): Promise<Books[]> {
        return this.bookService.getAll();
    }
            
    @Get(':id')
    @ApiOperation({ summary: 'Search Book' })
    findOne(@Param('id', ParseIntPipe) BookId: number): Promise<Books|null> {
        return this.bookService.findOne(+BookId);
    }
            
    @Post()
    @ApiOperation({ summary: 'Add Book' })
    create(@Body(CheckStringPipe) book: Partial<Books>): Promise<Books> {
        return this.bookService.create(book);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update Book' })
    update(@Param('id', ParseIntPipe) BookId: number, @Body(CheckStringPipe) user: Partial<Books>){
        return this.bookService.update(BookId, user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete Book' })
    remove(@Param('id', ParseIntPipe) BookId: number): Promise<void> {
        return this.bookService.remove(+BookId);
    }

}
