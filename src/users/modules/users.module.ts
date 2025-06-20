import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { CachingService } from 'src/cache/caching';
import { UsersController } from '../controllers/users.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService, CachingService],
  exports: [UsersService],
})
export class UsersModule {}
