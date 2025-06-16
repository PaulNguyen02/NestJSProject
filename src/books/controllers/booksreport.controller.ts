import{
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    HttpException,
    HttpStatus,
    Get,
    Res
}from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {ApiOperation, ApiBody, ApiTags ,ApiConsumes} from '@nestjs/swagger';
import { BooksService } from '../services/books.service';
import { uploadBody } from 'src/consts/uploadBody.config';
import { uploadOption } from 'src/consts/uploadOption.config';
@ApiTags('booksreport')
@Controller('booksreport')
export class BooksReportController{
    constructor(private readonly booksService: BooksService) {}
    @Post('booksupload')
    @UseInterceptors(FileInterceptor('file', uploadOption))
    @ApiConsumes('multipart/form-data')
    @ApiBody(uploadBody)
    @ApiOperation({ summary: 'Upload Excel file' })
    async uploadExcel(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
        throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        }
        const res =  await this.booksService.importBooksFromExcel(file.path);
        return {
            message: 'Upload thành công',
            completed_row: res.inserted
        }; 
    }

    @Get('books')
      @ApiOperation({ summary: 'Export Books' })
      async exportUsers(@Res() res: Response): Promise<void> {
        await this.booksService.exportBooksToExcel(res);
    }
}