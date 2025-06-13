import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';
import { ImportController } from '../controllers/users_import.controller';
import {ExportController} from '../controllers/users_export.controller';
import { UsersService } from '../services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity'
import { CachingService } from '../cache/user_caching';
import {PaginationController} from '../controllers/users_pagination.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController, ExportController, ImportController, PaginationController],
  providers: [UsersService, CachingService],
  exports: [UsersService],
})
export class UsersModule {}
