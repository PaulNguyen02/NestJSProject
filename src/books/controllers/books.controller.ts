import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param,
    Put,
    Delete, 
    ParseIntPipe,
    InternalServerErrorException,
    UploadedFile,
    UseInterceptors,
    Res,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { BooksService } from '../services/books.service';
import { Books } from '../entities/books.entity';
import { uploadBody } from 'src/consts/uploadBody.config';
import { uploadOption } from 'src/consts/uploadOption.config';
import { ExportBookDTO, ImportBookDTO } from 'src/dto/bookdto/book.dto';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiProduces, ApiResponse } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BooksController {
    constructor(private readonly bookService: BooksService) {}
    @Get()
    @ApiOperation({ summary: 'Get All Books' })
    findAll(): Promise<ExportBookDTO[]> {
        try{
            return this.bookService.getAll();
        }
        catch(error){
            throw new InternalServerErrorException('Không thể lấy danh sách sách');
        }
    }
    
    @Get('export-books')
    @ApiOperation({ summary: 'Export Books' })
    async exportUsers(@Res() res: Response): Promise<void> {
        return await this.bookService.exportBooksToExcel(res);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Search Book' })
    findOne(@Param('id') BookId: number): Promise<Books|null> {
        try{
            return this.bookService.findOne(+BookId);
        }catch(error){
            throw new InternalServerErrorException('Không thể lấy chi tiết sách');
        }
    }
          
    
    @Post()
    @ApiOperation({ summary: 'Add Book' })
    @ApiBody({ type: ImportBookDTO })
    create(@Body() book: Partial<ImportBookDTO>): Promise<Books> {
        try{
            return this.bookService.create(book);
        }
        catch(error)
        {
            throw new InternalServerErrorException('Không thêm sách được')
        }
    }
    
    @Post('books-upload')
    @UseInterceptors(FileInterceptor('file', uploadOption))
    @ApiConsumes('multipart/form-data')
    @ApiBody(uploadBody)
    @ApiOperation({ summary: 'Upload Excel file' })
    async uploadExcel(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        }
        const res =  await this.bookService.importBooksFromExcel(file.path);
        return {
            message: 'Upload thành công',
            completed_row: res.inserted
        }; 
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update Book' })
    @ApiBody({ type: ImportBookDTO })
    update(@Param('id') BookId: number, @Body() new_book: Partial<ImportBookDTO>){
        try{
            return this.bookService.update(BookId, new_book);            
        }
        catch(error)
        {
            throw new InternalServerErrorException('Không cập nhật được sách')
        }
    }


    @Delete(':id')
    @ApiOperation({ summary: 'Delete Book' })
    remove(@Param('id') BookId: number): Promise<ExportBookDTO | null> {
        try{
            return this.bookService.remove(+BookId);            
        }
        catch(error)
        {
            throw new InternalServerErrorException('Không xóa được sách')
        }
    }
}
