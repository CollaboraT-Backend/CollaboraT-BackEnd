import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/decorators/auth-public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) return isPublic;
    console.log('hi desde strategy');
    //if it´s not public, evaluate the bearer token
    return super.canActivate(context);
  }
}
