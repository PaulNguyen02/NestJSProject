import{
    Controller,
    Post,
    Get,
    Res,
    UploadedFile,
    UseInterceptors,
    HttpException,
    HttpStatus
}from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {ApiOperation, ApiBody, ApiTags ,ApiConsumes} from '@nestjs/swagger'
import { uploadOption } from 'src/consts/uploadOption.config';
import { uploadBody } from 'src/consts/uploadBody.config';
import { UsersService } from '../services/users.service';

@ApiTags('usersreport')
@Controller('usersreport')
export class UsersReportController{
    constructor(private readonly usersService: UsersService) {}

    @Get('users')
      @ApiOperation({ summary: 'Export User' })
      async exportUsers(@Res() res: Response): Promise<void> {
        await this.usersService.exportUsersToExcel(res);
    }

    @Post('usersupload')
    @UseInterceptors(FileInterceptor('file', uploadOption))
    @ApiConsumes('multipart/form-data')
    @ApiBody(uploadBody)
    @ApiOperation({ summary: 'Upload Excel file' })
    async uploadExcel(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
        throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        }
        const res = await this.usersService.importUsersFromExcel(file.path);
        return {
            message: 'Upload thành công',
            completed_row: res.inserted
        }; 
    }
}