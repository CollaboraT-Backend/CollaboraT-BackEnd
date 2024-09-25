import { IsNotEmpty, IsString } from 'class-validator';

export class HasPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
