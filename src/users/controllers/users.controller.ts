import { 
    Controller, 
    Get,  
    Body, 
    Param, 
    Post,
    Put,
    Delete, 
    Query,
    Res, 
    UploadedFile,
    UseInterceptors,
    HttpStatus,
    HttpException,
    InternalServerErrorException
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Users } from '../entities/users.entity';
import { UsersService } from '../services/users.service';
import { uploadBody } from 'src/consts/uploadBody.config';
import { uploadOption } from 'src/consts/uploadOption.config';
import { ExportUserDTO, UpdateUserDTO, PaginationQueryDto } from 'src/dto/userdto/user.dto';

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

    @Get('pagination')
    @ApiOperation({ summary: 'Paginate User' })
    getPaginatedUsers(@Query() query: PaginationQueryDto) {
        try{
            return this.userService.pagination(query);
        }catch(error){
            throw new InternalServerErrorException('Không thể phân trang');
        }
    }

    @Get('users')
    @ApiOperation({ summary: 'Export User' })
    async exportUsers(@Res() res: Response): Promise<void> {
        await this.userService.exportUsersToExcel(res);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Search User' })
    findOne(@Param('id') UserId: number): Promise<Users|null> {
        try{
            return this.userService.findOne(+UserId);
        }catch(error){
            throw new InternalServerErrorException('Không thể lấy thông tin người dùng');
        }
    }

    @Post('users-upload')
    @UseInterceptors(FileInterceptor('file', uploadOption))
    @ApiConsumes('multipart/form-data')
    @ApiBody(uploadBody)
    @ApiOperation({ summary: 'Upload Excel file' })
    async uploadExcel(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        }
        const res = await this.userService.importUsersFromExcel(file.path);
            return {
                message: 'Upload thành công',
                completed_row: res.inserted
        }; 
    }
    

    @Put(':id')
    @ApiOperation({ summary: 'Update User' })
    @ApiBody({ type: UpdateUserDTO })
    update(@Param('id') UserId: number, @Body() user: Partial<UpdateUserDTO>){
        try{
            return this.userService.update(UserId, user);
        }catch(error){
            throw new InternalServerErrorException('Không thể cập nhật người dùng');
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete User' })
    remove(@Param('id') UserId: number): Promise<ExportUserDTO | null> {
        try{
            return this.userService.remove(+UserId);
        }catch(error){
            throw new InternalServerErrorException('Không thể xóa người dùng');
        }
    }


}
