import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { PrismaService } from 'src/prisma-service/prisma-service.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      //Get user data from request
      const request = context.switchToHttp().getRequest();

      const { user } = request;

      //Get neccesary meta data
      const rbcaMetadata = this.reflector.get('rbca', context.getHandler());

      const { allowed_roles, allowed_action, resource_id } = rbcaMetadata;

      //if role have permissions or not
      if (!allowed_roles.includes(user.role)) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'This type of user does not have sufficient permissions',
        });
      }

      //Get type of user permissions from database
      const userRolePermissions = await this.prisma.permission.findFirst({
        where: { role: user.role, entityId: resource_id },
      });

      if (!userRolePermissions) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'No permissions found for this user role',
        });
      }

      if (!userRolePermissions[allowed_action]) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'This type of user does not have sufficient permissions',
        });
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        throw ErrorManager.createSignatureError('An unexpected error occurred');
      }
    }
  }
}
