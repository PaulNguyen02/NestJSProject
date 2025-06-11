import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import {ExportController} from './users_export.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity'
import { CachingService } from './user_caching';
import {PaginationController} from './users_pagination.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController, ExportController, PaginationController],
  providers: [UsersService, CachingService]
})
export class UsersModule {}
