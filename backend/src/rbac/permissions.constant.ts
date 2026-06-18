export const AVAILABLE_PERMISSIONS = {
  DASHBOARD: { view: 'dashboard:view' },
  JOBS: { view: 'jobs:view', create: 'jobs:create', edit: 'jobs:edit', delete: 'jobs:delete' },
  COMPANIES: { view: 'companies:view', create: 'companies:create', edit: 'companies:edit', delete: 'companies:delete' },
  CATEGORIES: { view: 'categories:view', create: 'categories:create', edit: 'categories:edit', delete: 'categories:delete' },
  USERS: { view: 'users:view', create: 'users:create', edit: 'users:edit', delete: 'users:delete' },
  TESTIMONIALS: { view: 'testimonials:view', create: 'testimonials:create', edit: 'testimonials:edit', delete: 'testimonials:delete' },
  FEATURED: { view: 'featured:view', create: 'featured:create', edit: 'featured:edit', delete: 'featured:delete' },
  SETTINGS: { view: 'settings:view', edit: 'settings:edit' },
  ROLES: { view: 'roles:view', create: 'roles:create', edit: 'roles:edit', delete: 'roles:delete' },
} as const;
