import { 
    Controller, 
    Get,  
    Body, 
    Param, 
    Put,
    Delete, 
    ParseIntPipe, 
    InternalServerErrorException 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Users } from '../entities/users.entity';
import { CheckNumberPipe } from '../pipes/checkingpipe';
import { UsersService } from '../services/users.service';
import { ExportUserDTO, ImportUserDTO } from 'src/dto/userdto/user.dto';

@ApiTags('users') // nhóm hiển thị trong Swagger
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}
    @Get()
    @ApiOperation({ summary: 'Get All Users' })
    findAll(): Promise<ExportUserDTO[]> {
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

    

    @Put(':id')
    @ApiOperation({ summary: 'Update User' })
    @ApiBody({ type: ImportUserDTO })
    update(@Param('id', ParseIntPipe) UserId: number, @Body(CheckNumberPipe) user: Partial<ImportUserDTO>){
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
