import { PermissionRole } from '@prisma/client';

export interface PayloadToken {
  sub: string;
  role: PermissionRole;
}
