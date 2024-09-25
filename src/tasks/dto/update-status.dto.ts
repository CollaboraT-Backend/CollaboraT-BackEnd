import {IsNotEmpty,IsEnum} from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class UpdateStatusDto {
    @IsNotEmpty()
    @IsEnum(TaskStatus)
    status: TaskStatus;
}