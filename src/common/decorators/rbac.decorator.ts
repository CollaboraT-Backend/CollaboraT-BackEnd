import { SetMetadata } from '@nestjs/common';
import { PermissionRole } from '@prisma/client';
import { ResourceActions } from '../constants/resource-actions.enum';

// Para obtener las claves del enum
type RoleKeys = keyof typeof PermissionRole;
type ActionsKeys = keyof typeof ResourceActions;
export const Rbac = (
  roles: RoleKeys[],
  action: ActionsKeys,
  resourceId: number,
) =>
  SetMetadata('rbca', {
    allowed_roles: roles,
    allowed_action: action,
    resource_id: resourceId,
  });
