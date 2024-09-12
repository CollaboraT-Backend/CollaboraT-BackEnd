import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { CompaniesModule } from './companies/companies.module';
import { PrismaServiceModule } from './prisma-service/prisma-service.module';

import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TasksModule,
    CompaniesModule,
    PrismaServiceModule,
  ],
  controllers: [],
})
export class AppModule {}
