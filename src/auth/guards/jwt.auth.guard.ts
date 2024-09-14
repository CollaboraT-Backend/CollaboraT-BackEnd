import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
    constructor(private readonly reflector:Reflector){
        super()
    }
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
        if(isPublic) return isPublic;

        //if not is public, evaluate the bearer token 
        return super.canActivate(context);
    }
}