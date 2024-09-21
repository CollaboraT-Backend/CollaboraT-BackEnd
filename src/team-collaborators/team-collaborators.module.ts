import { Module } from '@nestjs/common';
import { TeamCollaboratorsService } from './team-collaborators.service';
import { TeamCollaboratorsController } from './team-collaborators.controller';

@Module({
  controllers: [TeamCollaboratorsController],
  providers: [TeamCollaboratorsService],
})
export class TeamCollaboratorsModule {}
