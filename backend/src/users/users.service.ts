import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'Somchai Jaidee',
      email: 'somchai@example.com',
      role: 'Job Seeker',
      status: 'Active',
      avatar: '👨',
      createdAt: '2024-01-15',
      lastLogin: '2024-03-20',
      roleId: 4,
      permissions: ['dashboard:view', 'jobs:view', 'companies:view', 'users:view', 'testimonials:view'],
    },
    {
      id: 2,
      name: 'Siriwan Mekhom',
      email: 'siriwan@example.com',
      role: 'Employer',
      status: 'Active',
      avatar: '👩',
      createdAt: '2024-01-20',
      lastLogin: '2024-03-19',
      roleId: 4,
      permissions: ['dashboard:view', 'jobs:view', 'companies:view', 'users:view', 'testimonials:view'],
    },
    {
      id: 3,
      name: 'Admin User',
      email: 'admin@jobfinder.com',
      role: 'Admin',
      status: 'Active',
      avatar: '👤',
      createdAt: '2023-12-01',
      lastLogin: '2024-03-20',
      roleId: 2,
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
    },
    {
      id: 4,
      name: 'Kittisak Wongsa',
      email: 'kittisak@example.com',
      role: 'Job Seeker',
      status: 'Active',
      avatar: '👨‍💻',
      createdAt: '2024-02-10',
      lastLogin: '2024-03-18',
      roleId: 4,
      permissions: ['dashboard:view', 'jobs:view', 'companies:view', 'users:view', 'testimonials:view'],
    },
    {
      id: 5,
      name: 'Nattaya Chaiyo',
      email: 'nattaya@example.com',
      role: 'Employer',
      status: 'Inactive',
      avatar: '👩‍💼',
      createdAt: '2024-02-15',
      lastLogin: '2024-02-28',
      roleId: 4,
      permissions: ['dashboard:view', 'jobs:view', 'companies:view', 'users:view', 'testimonials:view'],
    },
    {
      id: 6,
      name: 'Pichit Sombat',
      email: 'pichit@example.com',
      role: 'Job Seeker',
      status: 'Active',
      avatar: '🧑',
      createdAt: '2024-03-01',
      lastLogin: '2024-03-20',
      roleId: 4,
      permissions: ['dashboard:view', 'jobs:view', 'companies:view', 'users:view', 'testimonials:view'],
    },
    {
      id: 7,
      name: 'Wipada Rerkchai',
      email: 'wipada@example.com',
      role: 'Job Seeker',
      status: 'Suspended',
      avatar: '👩‍🎨',
      createdAt: '2024-03-05',
      lastLogin: '2024-03-10',
      roleId: 4,
      permissions: ['dashboard:view', 'jobs:view', 'companies:view', 'users:view', 'testimonials:view'],
    },
    {
      id: 8,
      name: 'TechCorp HR',
      email: 'hr@techcorp.com',
      role: 'Employer',
      status: 'Active',
      avatar: '🏢',
      createdAt: '2024-01-10',
      lastLogin: '2024-03-19',
      roleId: 4,
      permissions: ['dashboard:view', 'jobs:view', 'companies:view', 'users:view', 'testimonials:view'],
    },
  ];

  constructor(private readonly rolesService: RolesService) {}

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  create(data: Partial<User>): User {
    let permissions: string[] = data.permissions || [];

    if (data.roleId) {
      permissions = this.rolesService.getPermissionsByRoleId(data.roleId);
    }

    const newUser: User = {
      id: this.users.length + 1,
      name: data.name || '',
      email: data.email || '',
      role: data.role || 'Job Seeker',
      status: data.status || 'Active',
      avatar: data.avatar || '👤',
      createdAt: data.createdAt || new Date().toISOString().split('T')[0],
      lastLogin: data.lastLogin || 'Never',
      roleId: data.roleId || 0,
      permissions,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, data: Partial<User>): User | null {
    const item = this.users.find(u => u.id === id);
    if (item) {
      if (data.roleId) {
        data.permissions = this.rolesService.getPermissionsByRoleId(data.roleId);
      }
      Object.assign(item, data);
      return item;
    }
    return null;
  }

  remove(id: number): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  assignPermissions(userId: number, permissions: string[]): User | null {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return null;
    }
    user.permissions = permissions;
    return user;
  }

  getUserPermissions(userId: number): { userId: number; roleId: number; permissions: string[] } | null {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return null;
    }
    return {
      userId: user.id,
      roleId: user.roleId,
      permissions: user.permissions,
    };
  }
}
