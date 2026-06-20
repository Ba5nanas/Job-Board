import { SetMetadata, Paramtype } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)

export const BACKOFFICE_ROLES_KEY = 'backofficeRoles'
export const BackofficeRoles = (...roles: string[]) =>
  SetMetadata(BACKOFFICE_ROLES_KEY, roles)

export const PERMISSIONS_KEY = 'permissions'
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions)
