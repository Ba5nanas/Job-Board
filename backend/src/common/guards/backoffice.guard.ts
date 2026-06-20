import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { BACKOFFICE_ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class BackofficeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(BACKOFFICE_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()

    if (!user || user.userType !== 'backoffice') {
      throw new ForbiddenException('Backoffice access required')
    }

    const hasRole = requiredRoles.includes(user.role)

    if (!hasRole) {
      throw new ForbiddenException('Insufficient backoffice permissions')
    }

    return true
  }
}
