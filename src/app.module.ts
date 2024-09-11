import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { CompaniesModule } from './companies/companies.module';
import { PrismaServiceModule } from './prisma-service/prisma-service.module';

import { ConfigModule } from '@nestjs/config';
@Module({
<<<<<<< HEAD
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TasksModule,
    CompaniesModule,
    PrismaServiceModule,
  ],
=======
  imports: [ConfigModule.forRoot({ isGlobal: true }), TasksModule],
>>>>>>> 925861f (Add Several global configurations and utils (Remove Auth files))
  controllers: [],
})
export class AppModule {}
