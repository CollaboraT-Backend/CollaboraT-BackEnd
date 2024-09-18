import {IsNotEmpty,IsString} from 'class-validator';

export class CreateOccupationDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}
  