import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Workbook } from 'exceljs';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as XLSX from 'xlsx';
import { Users } from '../entities/users.entity';
import { CachingService } from '../cache/user.caching';
import { PaginationQueryDto, ExportUserDTO, ImportUserDTO } from '../../dto/userdto/user.dto';
@Injectable()
export class UsersService {
    constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly cachingService: CachingService
    ){}

    async getAll(): Promise<ExportUserDTO[]>{
        const cacheKey = 'users:all';

        // Kiểm tra cache trước
        const cached = await this.cachingService.get(cacheKey);
        if (cached) {
        console.log('Trả dữ liệu từ Redis cache');
        return cached;
        }

        const users = await this.usersRepository.find();
        const result = plainToInstance(ExportUserDTO, users, {
            excludeExtraneousValues: true,
        });
        await this.cachingService.set(cacheKey, result, 60); // TTL: 60 giây
        return result;
    }

    async findOne(UserId: number): Promise<Users|null> {     
        return this.usersRepository.findOne({ where: { UserId } });
    }

    async findEmail(Email: string): Promise<Users|null> {
        return this.usersRepository.findOne({ where: { Email } });
    }

    async findResetPassToken(resetPasswordToken: string): Promise<Users|null> {
        return this.usersRepository.findOne({ where: { resetPasswordToken } });
    }

   async create(user: Partial<ImportUserDTO>): Promise<Users> {
        // 1. Kiểm tra username có tồn tại chưa
        const existing = await this.usersRepository.findOne({
            where: { UserName: user.UserName },
        });
        if (existing) {
            throw new Error('Username already exists');
        }
        if (!user.Pass) {
            throw new Error('Password is required');
        }
        // 2. Băm mật khẩu
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.Pass, salt);

        const userEntity = plainToInstance(Users, user);

        // 3. Tạo user mới
        const newUser = this.usersRepository.create({
            ...userEntity,
            Pass: hashedPassword,
        });

        // 4. Lưu vào DB
        return this.usersRepository.save(newUser);
    }

    async update(UserId: number, updateData: Partial<ImportUserDTO>): Promise<Users> {
        const existingUser = await this.usersRepository.findOne({ where: { UserId } });

        if (!existingUser) {
            throw new NotFoundException(`User with id ${UserId} not found`);
        }
        const newupdate = plainToInstance(Users, updateData);
        const updatedUser = this.usersRepository.merge(existingUser, newupdate);
        return await this.usersRepository.save(updatedUser);
    }

    async remove(UserId: number): Promise<void> {
        await this.usersRepository.delete(UserId);
    }

    async pagination(query: PaginationQueryDto) {
        const { limit, offset } = query;
        const [users, total] = await this.usersRepository.findAndCount({
            take: limit,
            skip: offset
        });
        const data = plainToInstance(ExportUserDTO,users,{excludeExtraneousValues: true,});
        return {
            data,
            total,
            limit,
            offset
        };
    }


    async exportUsersToExcel(res: Response): Promise<void> {
        const users = await this.getAll();
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Users');
        worksheet.columns = [
        { header: 'UserId', key: 'UserId', width: 10 },
        { header: 'UserName', key: 'UserName', width: 15},
        { header: 'FullName', key: 'FullName', width: 30 },
        { header: 'Email', key: 'Email', width: 30 },
        { header: 'Phone', key: 'Phone', width: 20 }
        ];
            
        users.forEach((user) => {
            worksheet.addRow({
                UserId: user.UserId,
                UserName: user.UserName,
                FullName: user.Fullname,
                Email: user.Email,
                Phone: user.Phone
            });
        });
    
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    }

    async findByUsername(UserName: string): Promise<Users | null> {
        return this.usersRepository.findOne({ where: { UserName } });
    }


    async importUsersFromExcel(filePath: string): Promise<{ inserted: number }> {
            const workbook = XLSX.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data: any[] = XLSX.utils.sheet_to_json(sheet);        //return Json data
    
             const users = data.map((row: any) => ({
                UserName: row.UserName,
                Fullname: row.FullName,
                Email: row.Email,
                Phone: row.Phone
            }));
    
            const result = await this.usersRepository.save(users);
            return { inserted: result.length };
    }
}
