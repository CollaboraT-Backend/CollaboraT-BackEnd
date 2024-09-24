import { Module, forwardRef } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { CollaboratorsModule } from 'src/collaborators/collaborators.module';
import { TeamCollaboratorsModule } from 'src/team-collaborators/team-collaborators.module';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [TeamCollaboratorsModule, forwardRef(() => CollaboratorsModule)],
  controllers: [ProjectsController],
  providers: [ProjectsService, MailerService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
