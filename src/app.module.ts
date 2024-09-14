import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { CompaniesModule } from './companies/companies.module';
import { PrismaServiceModule } from './prisma-service/prisma-service.module';
import { ProjectsModule } from './projects/projects.module';

import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from './comments/comments.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TasksModule,
    CompaniesModule,
    PrismaServiceModule,
    ProjectsModule,
    CommentsModule,
  ],
  controllers: [],
})
export class AppModule {}
