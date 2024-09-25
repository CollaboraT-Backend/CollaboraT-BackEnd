import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTeamCollaboratorDto {
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @IsNotEmpty()
  @IsUUID()
  collaboratorId: string;
}
