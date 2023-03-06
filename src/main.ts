import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exceptions/base.exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import {ValidationPipe} from '@nestjs/common'
import { join } from 'path';


async function bootstrap() {
  let app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname,'/images'),{
    prefix:'/images'
  })

  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)))
  app.useGlobalInterceptors(new TransformInterceptor)
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();
