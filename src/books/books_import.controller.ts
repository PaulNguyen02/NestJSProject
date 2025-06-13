import{
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    HttpException,
    HttpStatus,
    BadRequestException
}from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {ApiOperation, ApiBody, ApiTags ,ApiConsumes, ApiResponse} from '@nestjs/swagger'
import { diskStorage} from 'multer';
import { extname } from 'path';
import { BooksService } from './books.service';

@ApiTags('/v1/statistic_import')
@Controller('/v1/statistic_import')
export class ImportController{
    constructor(private readonly booksService: BooksService) {}
    @Post('upload')
    @UseInterceptors(
    FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
            ];

            if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
            } else {
            cb(new HttpException('Chỉ chấp nhận file Excel (.xls, .xlsx)', HttpStatus.BAD_REQUEST), false);
            }
        },
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
        type: 'object',
        properties: {
            file: {
            type: 'string',
            format: 'binary',
            },
        },
        },
    })
    @ApiOperation({ summary: 'Upload Excel file' })
    async uploadExcel(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
        throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        }
        const res =  this.booksService.importUsersFromExcel(file.path);
        return {
        message: 'Upload thành công',
        completed_row: (await res).inserted
        }; 
    }
}