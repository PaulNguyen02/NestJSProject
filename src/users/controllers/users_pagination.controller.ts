import { 
    Controller, 
    Get,
    Query,
    InternalServerErrorException
} from '@nestjs/common';
import { UsersService} from '../services/users.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaginationQueryDto } from '../dto/pagination_dto';


@ApiTags('/v1/user_pagination')
@Controller('/v1/user_pagination')
export class PaginationController {
  constructor(private readonly booksService: UsersService) {}

    @Get('pagination')
    @ApiOperation({ summary: 'Paginate User' })
    getPaginatedUsers(@Query() query: PaginationQueryDto) {
        try{
            return this.booksService.pagination(query);
        }catch(error){
            throw new InternalServerErrorException('Không thể phân trang');
        }
    }
  
}