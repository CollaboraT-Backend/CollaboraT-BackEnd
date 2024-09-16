import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsDate,
  IsEnum,
} from 'class-validator';
import { TaskPriority} from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  name: string;

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
  @IsUUID()
  collaboratorAssignedId: string;

  @IsNotEmpty()
  @IsUUID()
  createdById: string;
}
