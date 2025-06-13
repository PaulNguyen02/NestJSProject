import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Res,
    Put,
    Delete, 
    ParseIntPipe,
    InternalServerErrorException
} from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { Books } from '../entities/books.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CheckStringPipe } from '../pipes/checking_pipe';

@ApiTags('/v1/books')
@Controller('/v1/books')
export class BooksController {
    constructor(private readonly bookService: BooksService) {}
    @Get()
    @ApiOperation({ summary: 'Get All Books' })
    findAll(): Promise<Books[]> {
        try{
            return this.bookService.getAll();
        }
        catch(error){
            throw new InternalServerErrorException('Không thể lấy danh sách sách');
        }
    }
            
    @Get(':id')
    @ApiOperation({ summary: 'Search Book' })
    findOne(@Param('id', ParseIntPipe) BookId: number): Promise<Books|null> {
        try{
            return this.bookService.findOne(+BookId);
        }catch(error){
            throw new InternalServerErrorException('Không thể lấy chi tiết sách');
        }
    }
            
    @Post()
    @ApiOperation({ summary: 'Add Book' })
    create(@Body(CheckStringPipe) book: Partial<Books>): Promise<Books> {
        try{
            return this.bookService.create(book);
        }
        catch(error)
        {
            throw new InternalServerErrorException('Không thêm sách được')
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update Book' })
    update(@Param('id', ParseIntPipe) BookId: number, @Body(CheckStringPipe) user: Partial<Books>){
        try{
            return this.bookService.update(BookId, user);            
        }
        catch(error)
        {
            throw new InternalServerErrorException('Không cập nhật được sách')
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete Book' })
    remove(@Param('id', ParseIntPipe) BookId: number): Promise<void> {
        try{
            return this.bookService.remove(+BookId);            
        }
        catch(error)
        {
            throw new InternalServerErrorException('Không xóa được sách')
        }
    }

    
    
}
