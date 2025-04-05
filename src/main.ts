import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'fatal'],
    rawBody: true,
  });

  const config = new DocumentBuilder()
    .setTitle('EscalaMed')
    .setDescription('Documentação da API EscalaMed')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Insira o token JWT no formato: Bearer <token>',
        in: 'header',
      },
      'JWT-auth', // Este nome é usado para referenciar o esquema
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe());
  app.use(compression());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((e: any) => console.error(e));
