import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsDate} from 'class-validator';


export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  goals?: string;

  @IsNotEmpty()
  @IsDate()
  deadline: Date;

  @IsNotEmpty()
  @IsUUID()
  companyId: string;
}
