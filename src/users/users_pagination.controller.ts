import { 
    Controller, 
    Get,
    Query
} from '@nestjs/common';
import { UsersService} from './users.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaginationQueryDto } from './pagination_dto';


@ApiTags('/v1/user_pagination')
@Controller('/v1/user_pagination')
export class PaginationController {
  constructor(private readonly booksService: UsersService) {}

    @Get('pagination')
    @ApiOperation({ summary: 'Paginate User' })
    getPaginatedUsers(@Query() query: PaginationQueryDto) {
        console.log('Query:', query);
        return this.booksService.pagination(query);
    }
  
}