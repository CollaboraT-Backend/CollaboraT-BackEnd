import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { CompaniesModule } from './companies/companies.module';
import { PrismaServiceModule } from './prisma-service/prisma-service.module';

@Module({
  imports: [TasksModule, CompaniesModule, PrismaServiceModule],
  controllers: [],
  
})
export class AppModule {}
