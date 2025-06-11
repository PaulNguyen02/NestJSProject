import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Put,
    Delete, 
    ParseIntPipe, 
    Query 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CheckNumberPipe } from './checking_pipe';
import { PaginationQueryDto } from './pagination_dto';
@ApiTags('/v1/users') // nhóm hiển thị trong Swagger
@Controller('/v1/users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}
    @Get()
    @ApiOperation({ summary: 'Get All Users' })
    findAll(): Promise<Users[]> {
        return this.userService.getAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Search User' })
    findOne(@Param('id', ParseIntPipe) UserId: number): Promise<Users|null> {
        return this.userService.findOne(+UserId);
    }

    @Post()
    @ApiOperation({ summary: 'Create User' })
    create(@Body(CheckNumberPipe) user: Partial<Users>): Promise<Users> {
        return this.userService.create(user);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update User' })
    update(@Param('id', ParseIntPipe) UserId: number, @Body(CheckNumberPipe) user: Partial<Users>){
        return this.userService.update(UserId, user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete User' })
    remove(@Param('id', ParseIntPipe) UserId: number): Promise<void> {
        return this.userService.remove(+UserId);
    }

}
