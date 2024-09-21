import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeamCollaboratorsService } from './team-collaborators.service';
import { CreateTeamCollaboratorDto } from './dto/create-team-collaborator.dto';
import { UpdateTeamCollaboratorDto } from './dto/update-team-collaborator.dto';

@Controller('team-collaborators')
export class TeamCollaboratorsController {
  constructor(private readonly teamCollaboratorsService: TeamCollaboratorsService) {}

  @Post()
  create(@Body() createTeamCollaboratorDto: CreateTeamCollaboratorDto) {
    return this.teamCollaboratorsService.create(createTeamCollaboratorDto);
  }

  @Get()
  findAll() {
    return this.teamCollaboratorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamCollaboratorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamCollaboratorDto: UpdateTeamCollaboratorDto) {
    return this.teamCollaboratorsService.update(+id, updateTeamCollaboratorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamCollaboratorsService.remove(+id);
  }
}
