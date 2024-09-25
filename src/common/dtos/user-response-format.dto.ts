import { PermissionRole } from '@prisma/client';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class UserResponseFormatDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: PermissionRole;

  @IsString()
  @IsNotEmpty()
  nit: string;

  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @IsPositive()
  @IsNotEmpty()
  occupationId: number;

  @IsObject()
  @IsOptional()
  company: object;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
