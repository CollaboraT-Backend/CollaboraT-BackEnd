import { Module, forwardRef } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { CollaboratorsController } from './collaborators.controller';
import { FilesModule } from 'src/files/files.module';
import { OccupationsModule } from 'src/occupations/occupations.module';
import { AuthModule } from 'src/auth/auth.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { MailerService } from 'src/mailer/mailer.service';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => CompaniesModule),
    FilesModule,
    OccupationsModule,
    forwardRef(() => ProjectsModule),
  ],
  controllers: [CollaboratorsController],
  providers: [CollaboratorsService, MailerService],
  exports: [CollaboratorsService],
})
export class CollaboratorsModule {}
