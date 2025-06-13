import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from '../dto/pagination_dto';
import { CachingService } from '../cache/user_caching';
import { Workbook } from 'exceljs';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as XLSX from 'xlsx';
@Injectable()
export class UsersService {
    constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly cachingService: CachingService
    ){}

    async getAll(): Promise<Users[]>{
        const cacheKey = 'users:all';

        // Kiểm tra cache trước
        const cached = await this.cachingService.get(cacheKey);
        if (cached) {
        console.log('Trả dữ liệu từ Redis cache');
        return cached;
        }

        const users = await this.usersRepository.find();
        await this.cachingService.set(cacheKey, users, 60); // TTL: 60 giây
        return users;
    }

    async findOne(UserId: number): Promise<Users|null> {
        return this.usersRepository.findOne({ where: { UserId } });
    }

    /*create(user: Partial<Users>): Promise<Users> {  //Partial là tạo ra 1 object nơi các thuôc tính nó đã tồn tại
        return this.usersRepository.save(user);
    }*/
   async create(user: Partial<Users>): Promise<Users> {
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

        // 3. Tạo user mới
        const newUser = this.usersRepository.create({
            ...user,
            Pass: hashedPassword,
        });

        // 4. Lưu vào DB
        return this.usersRepository.save(newUser);
    }

    async update(UserId: number, updateData: Partial<Users>): Promise<Users> {
        const existingUser = await this.usersRepository.findOne({ where: { UserId } });

        if (!existingUser) {
            throw new NotFoundException(`User with id ${UserId} not found`);
        }
        const updatedUser = this.usersRepository.merge(existingUser, updateData);
        return await this.usersRepository.save(updatedUser);
    }

    async remove(UserId: number): Promise<void> {
        await this.usersRepository.delete(UserId);
    }

    async pagination(query: PaginationQueryDto) {
        const { limit, offset } = query;
        const [data, total] = await this.usersRepository.findAndCount({
            take: limit,
            skip: offset
        });

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
