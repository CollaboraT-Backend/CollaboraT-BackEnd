import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ProjectStatus } from '@prisma/client';

export class UpdateProjectDto extends PartialType(
  OmitType(CreateProjectDto, ['companyId'] as const),
) {
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
