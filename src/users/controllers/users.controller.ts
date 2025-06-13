import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Put,
    Delete, 
    ParseIntPipe, 
    InternalServerErrorException 
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { Users } from '../entities/users.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CheckNumberPipe } from '../pipes/checking_pipe';
import { UserDTO } from '../dto/user.dto';
import { ApiBody } from '@nestjs/swagger';
@ApiTags('/v1/users') // nhóm hiển thị trong Swagger
@Controller('/v1/users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}
    @Get()
    @ApiOperation({ summary: 'Get All Users' })
    findAll(): Promise<Users[]> {
        try{
            return this.userService.getAll();            
        }catch(error){
            throw new InternalServerErrorException('Không thể lấy danh sách người dùng');
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Search User' })
    findOne(@Param('id', ParseIntPipe) UserId: number): Promise<Users|null> {
        try{
            return this.userService.findOne(+UserId);
        }catch(error){
            throw new InternalServerErrorException('Không thể lấy thông tin sách');
        }
    }

    @Post()
    @ApiBody({ type: UserDTO })
    @ApiOperation({ summary: 'Create User' })
    create(@Body(CheckNumberPipe) user: Partial<Users>): Promise<Users> {
        try{
            return this.userService.create(user);
        }catch(error){
            throw new InternalServerErrorException('Không thể tạo sách');
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update User' })
    update(@Param('id', ParseIntPipe) UserId: number, @Body(CheckNumberPipe) user: Partial<Users>){
        try{
            return this.userService.update(UserId, user);
        }catch(error){
            throw new InternalServerErrorException('Không thể cập nhật sách');
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete User' })
    remove(@Param('id', ParseIntPipe) UserId: number): Promise<void> {
        try{
            return this.userService.remove(+UserId);
        }catch(error){
            throw new InternalServerErrorException('Không thể xóa sách');
        }
    }

}
