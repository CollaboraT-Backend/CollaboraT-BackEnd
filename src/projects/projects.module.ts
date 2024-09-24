import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TeamCollaboratorsService } from 'src/team-collaborators/team-collaborators.service';

@Module({
  imports: [TeamCollaboratorsService],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
