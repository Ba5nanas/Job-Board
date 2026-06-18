import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { AVAILABLE_PERMISSIONS } from '../rbac/permissions.constant';

function getAllPermissions(): string[] {
  const all: string[] = [];
  for (const category of Object.values(AVAILABLE_PERMISSIONS)) {
    for (const perm of Object.values(category as Record<string, string>)) {
      all.push(perm);
    }
  }
  return all;
}

@Injectable()
export class RolesService {
  private roles: Role[] = [
    {
      id: 1,
      name: 'super_admin',
      displayName: 'Super Admin',
      description: 'Full access to all features including role management',
      permissions: getAllPermissions(),
      createdAt: new Date().toISOString().split('T')[0],
    },
    {
      id: 2,
      name: 'admin',
      displayName: 'Admin',
      description: 'Full access except role management',
      permissions: [
        'dashboard:view',
        'jobs:view', 'jobs:create', 'jobs:edit', 'jobs:delete',
        'companies:view', 'companies:create', 'companies:edit', 'companies:delete',
        'categories:view', 'categories:create', 'categories:edit', 'categories:delete',
        'users:view', 'users:create', 'users:edit', 'users:delete',
        'testimonials:view', 'testimonials:create', 'testimonials:edit', 'testimonials:delete',
        'featured:view', 'featured:create', 'featured:edit', 'featured:delete',
        'settings:view', 'settings:edit',
      ],
      createdAt: new Date().toISOString().split('T')[0],
    },
    {
      id: 3,
      name: 'moderator',
      displayName: 'Moderator',
      description: 'Can view all and edit jobs, companies, testimonials, and featured items',
      permissions: [
        'dashboard:view',
        'jobs:view', 'jobs:edit',
        'companies:view', 'companies:edit',
        'categories:view',
        'users:view',
        'testimonials:view', 'testimonials:edit',
        'featured:view', 'featured:edit',
        'settings:view',
      ],
      createdAt: new Date().toISOString().split('T')[0],
    },
    {
      id: 4,
      name: 'support',
      displayName: 'Support',
      description: 'Can view jobs, companies, users, and testimonials only',
      permissions: [
        'dashboard:view',
        'jobs:view',
        'companies:view',
        'users:view',
        'testimonials:view',
      ],
      createdAt: new Date().toISOString().split('T')[0],
    },
  ];

  findAll(): Role[] {
    return this.roles;
  }

  findOne(id: number): Role {
    const role = this.roles.find(r => r.id === id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  create(data: Partial<Role>): Role {
    const newRole: Role = {
      id: this.roles.length ? Math.max(...this.roles.map(r => r.id)) + 1 : 1,
      name: data.name || '',
      displayName: data.displayName || '',
      description: data.description || '',
      permissions: data.permissions || [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.roles.push(newRole);
    return newRole;
  }

  update(id: number, data: Partial<Role>): Role {
    const role = this.findOne(id);
    Object.assign(role, data);
    return role;
  }

  remove(id: number): boolean {
    const index = this.roles.findIndex(r => r.id === id);
    if (index !== -1) {
      this.roles.splice(index, 1);
      return true;
    }
    return false;
  }

  getPermissionsByRoleId(roleId: number): string[] {
    const role = this.findOne(roleId);
    return role.permissions;
  }
}
