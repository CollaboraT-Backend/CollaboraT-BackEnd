import { Module } from '@nestjs/common';
import { ProjectTeamsService } from './project-teams.service';
import { ProjectTeamsController } from './project-teams.controller';

@Module({
  controllers: [ProjectTeamsController],
  providers: [ProjectTeamsService],
})
export class ProjectTeamModule {}
