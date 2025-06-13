import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('API bookstore')
    .setDescription('Swagger Doc for Bookstore API')
    .setVersion('1.0')
    .addTag('books') // Tùy chọn
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document,{
      swaggerOptions: {
      docExpansion: 'none', // hoặc 'list' hoặc 'full' để thử
      defaultModelsExpandDepth: -1,
      persistAuthorization: true,
    },
  }); 

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
