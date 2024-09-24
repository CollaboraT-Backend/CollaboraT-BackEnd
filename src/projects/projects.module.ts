import { Module, forwardRef } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TeamCollaboratorsService } from 'src/team-collaborators/team-collaborators.service';
import { CollaboratorsModule } from 'src/collaborators/collaborators.module';
import { TeamCollaboratorsModule } from 'src/team-collaborators/team-collaborators.module';

@Module({
  imports: [TeamCollaboratorsModule, forwardRef(() => CollaboratorsModule)],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
