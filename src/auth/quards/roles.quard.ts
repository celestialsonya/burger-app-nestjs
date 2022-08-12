import {
    CanActivate,
    ExecutionContext, ForbiddenException,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import * as jwt from "jsonwebtoken";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "../roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate{

    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const req = context.switchToHttp().getRequest()

        try {

            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ])

            if (!requiredRoles){
                return true
            }
            const authHeader = req.headers.authorization

            const bearer = authHeader.split(" ")[0]
            const token = authHeader.split(" ")[1]

            if ( !token ){
                throw new UnauthorizedException({message: "User is not authorized"})
            }

            const data = jwt.verify(token, process.env.SECRET)

            const {role} = data.role
            const ok: boolean = requiredRoles.includes(role)

            return ok;
        } catch (e){
            console.log(e)
            throw new ForbiddenException({message: "No access"})
        }
    }

}