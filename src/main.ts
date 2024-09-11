import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  //Configure cors options
  const corsOptionsDelegate = (req: Request, callback: any) => {
    const allowList = [];
    let corsOptions;
    //evalue origin of request
    if (allowList.indexOf(req.headers['origin']) !== -1) {
      //enable access
      corsOptions = { origin: true };
    } else {
      //deny access access
      corsOptions = { origin: false };
    }
    callback(null, corsOptions);
  };
  //enable cors
  app.enableCors(corsOptionsDelegate);

  //for validating and transforming input data based on Dto's
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //enable serialization of response objects (apply class-transformer)
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  await app.listen(3000);
}
bootstrap();
