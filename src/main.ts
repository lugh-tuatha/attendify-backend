import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, 
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Attenify API')
    .setDescription('Attenify API description')
    .setVersion('2.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:4200','http://localhost:8000', 'http://localhost:3001', 'http://10.71.136.117:3001', 'http://192.168.25.117:3001', 'https://lthmi-attendify.netlify.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalFilters(new HttpExceptionFilter()); 
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
} 
bootstrap();
