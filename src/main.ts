import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Esta linha rejeita propriedades que não estejam validadas com decorador no .dto
    forbidNonWhitelisted: true, // Esta linha gera um erro quando na requisição vierem propriedades não validadas com decorador no .dto
    transform: true, // Este recurso converte o objeto de entrada em uma instância do DTO correspondente
  }))
  await app.listen(3000);
}
bootstrap();
