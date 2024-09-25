import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TeamCollaboratorsService } from './team-collaborators.service';
import { CreateTeamCollaboratorDto } from './dto/create-team-collaborator.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { PermissionsGuard } from 'src/permissions/permissions.guard';
import { Rbac } from 'src/common/decorators/rbac.decorator';

@UseGuards(JwtAuthGuard)
@ApiTags('team-collaborators')
@Controller('team-collaborators')
export class TeamCollaboratorsController {
  constructor(
    private readonly teamCollaboratorsService: TeamCollaboratorsService,
  ) {}

  @Rbac(['leader'], 'canCreate', 5)
  @UseGuards(PermissionsGuard)
  @Post()
  create(@Body() createTeamCollaboratorDto: CreateTeamCollaboratorDto) {
    return this.teamCollaboratorsService.create(createTeamCollaboratorDto);
  }
}
