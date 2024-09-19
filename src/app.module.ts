import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { CompaniesModule } from './companies/companies.module';
import { PrismaServiceModule } from './prisma-service/prisma-service.module';
import { ProjectsModule } from './projects/projects.module';
import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { S3Module } from './s3/s3.module';
import { ProfilePicturesModule } from './profile-pictures/profile-pictures.module';
import { OccupationsModule } from './occupations/occupations.module';
import { FilesModule } from './files/files.module';
import { CollaboratorsModule } from './collaborators/collaborators.module';
import { ProjectTemModule } from './project-tem/project-tem.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TasksModule,
    CompaniesModule,
    PrismaServiceModule,
    ProjectsModule,
    CommentsModule,
    AuthModule,
    S3Module,
    ProfilePicturesModule,
    OccupationsModule,
    FilesModule,
    CollaboratorsModule,
    ProjectTemModule,
  ],
  controllers: [],
})
export class AppModule {}
