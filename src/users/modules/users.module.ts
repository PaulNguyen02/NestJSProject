import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity'
import { CachingService } from '../cache/user_caching';
import { UsersController } from '../controllers/users.controller';
import { UsersReportController } from '../controllers/users_report.controller';
import {UsersPaginationController} from '../controllers/users_pagination.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController, UsersReportController, UsersPaginationController],
  providers: [UsersService, CachingService],
  exports: [UsersService],
})
export class UsersModule {}
