import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsDate,
  IsEnum,
  IsInt,
} from 'class-validator';
import { TaskPriority } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  dueDate: Date;

  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @IsNotEmpty()
  @IsInt()
  occupationId: number;

  @IsOptional()
  @IsUUID()
  collaboratorAssignedId: string;

  @IsOptional()
  @IsUUID()
  createdById: string;
}
