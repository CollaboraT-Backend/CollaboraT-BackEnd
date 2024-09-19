import { PartialType } from '@nestjs/swagger';
import { CreateProjectTemDto } from './create-project-tem.dto';

export class UpdateProjectTemDto extends PartialType(CreateProjectTemDto) {}
