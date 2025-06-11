import { 
    Controller, 
    Get,
    Res
} from '@nestjs/common';
import { UsersService} from './users.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('/v1/statistic_export')
@Controller('/v1/statistic_export')
export class ExportController {
  constructor(private readonly booksService: UsersService) {}

  @Get('users')
  @ApiOperation({ summary: 'Export User' })
  async exportUsers(@Res() res: Response): Promise<void> {
    await this.booksService.exportUsersToExcel(res);
  }
}