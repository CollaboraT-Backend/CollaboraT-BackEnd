import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  //Configure cors options
  const corsOptionsDelegate = (req: Request, callback: any) => {
    const allowList = ['http://localhost:3000'];
    let corsOptions: { origin: boolean };
    //evalue origin of request
    if (allowList.indexOf(req.headers['origin']) !== -1) {
      //enable access
      corsOptions = { origin: true };
    } else {
      //access denied
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

  //Config Swagger to API Documentation
  const config = new DocumentBuilder()
    .setTitle('Collabora-T API')
    .setDescription(
      'Collabora-T is a robust platform designed for companies to manage their projects efficiently and collaboratively. Inspired by tools like Jira, our system provides a comprehensive solution for planning, monitoring and executing projects, adapting to the specific needs of each organization.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('collaborat/api/v1/docs', app, document);
  await app.listen(4000);
}
bootstrap();
