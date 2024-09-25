import { PermissionRole } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CollaboratorFormatToExcel {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: PermissionRole;

  @IsDate()
  createdAt: Date;

  @Exclude()
  id: string;

  @Exclude()
  companyId: string;

  @Exclude()
  occupationId: number;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
