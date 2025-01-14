import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
   
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
