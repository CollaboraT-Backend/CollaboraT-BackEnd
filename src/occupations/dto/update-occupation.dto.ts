import { PartialType } from '@nestjs/swagger';
import { CreateOccupationDto } from './create-occupation.dto';

export class UpdateOccupationDto extends PartialType(CreateOccupationDto) {}
