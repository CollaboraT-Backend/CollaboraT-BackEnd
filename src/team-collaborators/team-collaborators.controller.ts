import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeamCollaboratorsService } from './team-collaborators.service';
import { CreateTeamCollaboratorDto } from './dto/create-team-collaborator.dto';
import { UpdateTeamCollaboratorDto } from './dto/update-team-collaborator.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('team-collaborators')
@Controller('team-collaborators')
export class TeamCollaboratorsController {
  constructor(
    private readonly teamCollaboratorsService: TeamCollaboratorsService,
  ) {}

  @Post()
  create(@Body() createTeamCollaboratorDto: CreateTeamCollaboratorDto) {
    return this.teamCollaboratorsService.create(createTeamCollaboratorDto);
  }
}
