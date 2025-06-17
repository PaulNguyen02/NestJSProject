import { Module } from '@nestjs/common';
import { UsersModule } from './users/modules/users.module';
import { BooksModule } from './books/modules/books.module';
import { InvoiceModule } from './invoice/modules/invoice.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/modules/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
@Module({
  imports: [
    UsersModule, 
    BooksModule, 
    InvoiceModule, 
    ConfigModule.forRoot({
      isGlobal: true, // Cho phép dùng ConfigService ở mọi nơi
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],    //Tạo một configure
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mssql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '1433', 10),
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        synchronize: false,   //Tự độn tạo bảng và migrations qua csdl nếu là true
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        options: {
          trustServerCertificate: true
        },
      }),
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
          user: process.env.AUTH_USER,
          pass: process.env.AUTH_PASS, // dùng App password chứ không phải mật khẩu gmail thường
        },
      },
      defaults: {
        from: '"Support" <your-email@gmail.com>',
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}
