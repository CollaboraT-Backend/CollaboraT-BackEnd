import { PartialType } from '@nestjs/swagger';
import { CreateTeamCollaboratorDto } from './create-team-collaborator.dto';

export class UpdateTeamCollaboratorDto extends PartialType(CreateTeamCollaboratorDto) {}
