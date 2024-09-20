import { PartialType } from '@nestjs/swagger';
import { CreateProjectTeamDto } from './create-project-tem.dto';

export class UpdateProjectTeamDto extends PartialType(CreateProjectTeamDto) {}
