import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PUBLIC_ROUTE_KEY } from '../decorators/public.decorator'
import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private publicRoutes: string[] = [
    '/auth/login/job-seeker',
    '/auth/login/company',
    '/auth/login/backoffice',
    '/auth/register/job-seeker',
    '/auth/register/company',
    '/auth/refresh',
    '/health',
  ]

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const path = request.url

    if (this.publicRoutes.includes(path)) {
      return true
    }

    const authHeader = request.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided')
    }

    const token = authHeader.split(' ')[1]

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      })

      request.user = {
        userId: payload.sub,
        email: payload.email,
        userType: payload.userType,
        role: payload.role,
        companyId: payload.companyId,
      }
      return true
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
