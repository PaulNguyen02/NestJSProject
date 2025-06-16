import { 
    Controller, 
    Get,
    Query,
    InternalServerErrorException
} from '@nestjs/common';
import { UsersService} from '../services/users.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../dto/userdto/user.dto';


@ApiTags('userspagination')
@Controller('userspagination')
export class UsersPaginationController {
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