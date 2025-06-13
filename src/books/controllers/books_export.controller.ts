import { 
    Controller, 
    Get,
    Res
} from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { ApiTags, ApiOperation} from '@nestjs/swagger';
import { Response } from 'express';


@ApiTags('/v1/statistic_export')
@Controller('/v1/statistic_export')
export class ExportController {
  constructor(private readonly booksService: BooksService) {}

  @Get('books')
  @ApiOperation({ summary: 'Export Books' })
  async exportUsers(@Res() res: Response): Promise<void> {
    await this.booksService.exportBooksToExcel(res);
  }
}