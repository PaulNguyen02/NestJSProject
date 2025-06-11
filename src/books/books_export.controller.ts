import { 
    Controller, 
    Get,
    Res,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException
} from '@nestjs/common';
import { BooksService } from './books.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage} from 'multer';
import { extname } from 'path';
import { Express } from 'express';

@ApiTags('/v1/statistic_export')
@Controller('/v1/statistic_export')
export class ExportController {
  constructor(private readonly booksService: BooksService) {}

  @Get('books')
  @ApiOperation({ summary: 'Export Books' })
  async exportUsers(@Res() res: Response): Promise<void> {
    await this.booksService.exportBooksToExcel(res);
  }


  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // thư mục lưu tạm
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    console.log('File:', file); // kiểm tra thật sự file có trường path không
    const fileWithPath = file as Express.Multer.File & { path: string };
    if (!fileWithPath.path) {
      throw new BadRequestException('Không tìm thấy đường dẫn file (path)');
    }
    return this.booksService.importUsersFromExcel(fileWithPath.path);
  }
}