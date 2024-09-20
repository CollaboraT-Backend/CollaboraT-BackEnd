import { IsString, IsUUID } from "class-validator";

export class CreateProjectTeamDto {
    @IsString()
    @IsUUID()
    projectId: string;
  
    @IsString()
    @IsUUID()
    leaderId: string;
}
