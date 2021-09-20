import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const logger = new Logger('main');

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
  logger.log(`Application listerner on port: '${process.env.PORT}' and APPID: ${process.pid}`);

}

bootstrap();
