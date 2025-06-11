import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { InvoiceModule } from './invoice/invoice.module';
import { InvoiceDetailModule } from './invoice_detail/invoice_detail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    UsersModule, 
    BooksModule, 
    InvoiceModule, 
    InvoiceDetailModule,
    ConfigModule.forRoot({
      isGlobal: true, // Cho phép dùng ConfigService ở mọi nơi
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],    //Tạo một configure
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get<string>('DB_HOST') ?? 'localhost',
        port: parseInt(configService.get<string>('DB_PORT') ?? '1433', 10),
        database: configService.get<string>('DB_NAME') ?? 'bookstoredb',
        username: configService.get<string>('DB_USER') ?? 'sa',
        password: configService.get<string>('DB_PASS') ?? '12345',
        synchronize: false,   //Tự độn tạo bảng và migrations qua csdl nếu là true
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        options: {
          trustServerCertificate: true,
          //trustedConnection: true,
        },
      }),
    }),
    AuthModule,
  ],
})
export class AppModule {}
