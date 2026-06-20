import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { JwtAuthGuard } from './jwt-auth.guard'

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
  constructor(
    reflector: Reflector,
    jwtService: JwtService,
    configService: ConfigService,
  ) {
    super(reflector, jwtService, configService)
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization']

    if (!authHeader) {
      return true
    }

    return super.canActivate(context)
  }
}
