import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const prefix = "api/v1";
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(prefix);
  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('API bookstore')
    .setDescription('Swagger Doc for Bookstore API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document,{
      swaggerOptions: {
      docExpansion: 'none', // hoặc 'list' hoặc 'full' để thử
      defaultModelsExpandDepth: -1,
      persistAuthorization: true,
    },
  }); 

  SwaggerModule.setup(prefix + '/docs', app, document); //Hiển thị lên giao diện của swagger
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
