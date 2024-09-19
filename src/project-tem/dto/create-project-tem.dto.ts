import { IsString, IsUUID } from "class-validator";

export class CreateProjectTemDto {
    @IsString()
    @IsUUID()
    projectId: string;
  
    @IsString()
    @IsUUID()
    leaderId: string;
}
