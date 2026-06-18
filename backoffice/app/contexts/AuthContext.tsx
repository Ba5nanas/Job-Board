'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const API_BASE = 'http://localhost:3001'

export interface Permission {
  module: string
  action: string
}

export interface Role {
  id: number
  name: string
  displayName: string
  description: string
  level: string
  permissions: Permission[]
  createdAt: string
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  roleId?: number
  status: string
  avatar: string
  createdAt: string
  lastLogin: string
  customPermissions?: Permission[]
}

interface AuthContextType {
  currentUser: User
  roles: Role[]
  hasPermission: (permission: string) => boolean
  hasRole: (roleName: string) => boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const defaultPermissions: Permission[] = [
  { module: 'dashboard', action: 'view' },
  { module: 'jobs', action: 'view' },
  { module: 'jobs', action: 'create' },
  { module: 'jobs', action: 'edit' },
  { module: 'jobs', action: 'delete' },
  { module: 'companies', action: 'view' },
  { module: 'companies', action: 'create' },
  { module: 'companies', action: 'edit' },
  { module: 'companies', action: 'delete' },
  { module: 'categories', action: 'view' },
  { module: 'categories', action: 'create' },
  { module: 'categories', action: 'edit' },
  { module: 'categories', action: 'delete' },
  { module: 'users', action: 'view' },
  { module: 'users', action: 'create' },
  { module: 'users', action: 'edit' },
  { module: 'users', action: 'delete' },
  { module: 'testimonials', action: 'view' },
  { module: 'testimonials', action: 'create' },
  { module: 'testimonials', action: 'edit' },
  { module: 'testimonials', action: 'delete' },
  { module: 'featured', action: 'view' },
  { module: 'featured', action: 'create' },
  { module: 'featured', action: 'edit' },
  { module: 'featured', action: 'delete' },
  { module: 'settings', action: 'view' },
  { module: 'settings', action: 'edit' },
  { module: 'roles', action: 'view' },
  { module: 'roles', action: 'create' },
  { module: 'roles', action: 'edit' },
  { module: 'roles', action: 'delete' },
]

const defaultRoles: Role[] = [
  {
    id: 1,
    name: 'super_admin',
    displayName: 'Super Administrator',
    description: 'Full access to all system features',
    level: 'super_admin',
    permissions: defaultPermissions,
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    name: 'admin',
    displayName: 'Administrator',
    description: 'Manage users, jobs, and content',
    level: 'admin',
    permissions: [
      { module: 'dashboard', action: 'view' },
      { module: 'jobs', action: 'view' },
      { module: 'jobs', action: 'create' },
      { module: 'jobs', action: 'edit' },
      { module: 'jobs', action: 'delete' },
      { module: 'companies', action: 'view' },
      { module: 'companies', action: 'create' },
      { module: 'companies', action: 'edit' },
      { module: 'companies', action: 'delete' },
      { module: 'categories', action: 'view' },
      { module: 'categories', action: 'create' },
      { module: 'categories', action: 'edit' },
      { module: 'categories', action: 'delete' },
      { module: 'users', action: 'view' },
      { module: 'users', action: 'create' },
      { module: 'users', action: 'edit' },
      { module: 'testimonials', action: 'view' },
      { module: 'testimonials', action: 'create' },
      { module: 'testimonials', action: 'edit' },
      { module: 'featured', action: 'view' },
      { module: 'featured', action: 'create' },
      { module: 'featured', action: 'edit' },
      { module: 'settings', action: 'view' },
      { module: 'settings', action: 'edit' },
    ],
    createdAt: '2024-01-01',
  },
  {
    id: 3,
    name: 'moderator',
    displayName: 'Moderator',
    description: 'Manage jobs and content only',
    level: 'moderator',
    permissions: [
      { module: 'dashboard', action: 'view' },
      { module: 'jobs', action: 'view' },
      { module: 'jobs', action: 'create' },
      { module: 'jobs', action: 'edit' },
      { module: 'companies', action: 'view' },
      { module: 'testimonials', action: 'view' },
      { module: 'testimonials', action: 'edit' },
      { module: 'featured', action: 'view' },
    ],
    createdAt: '2024-01-01',
  },
  {
    id: 4,
    name: 'support',
    displayName: 'Support Agent',
    description: 'View-only access to most features',
    level: 'support',
    permissions: [
      { module: 'dashboard', action: 'view' },
      { module: 'jobs', action: 'view' },
      { module: 'companies', action: 'view' },
      { module: 'categories', action: 'view' },
      { module: 'users', action: 'view' },
      { module: 'testimonials', action: 'view' },
    ],
    createdAt: '2024-01-01',
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: 'Admin User',
    email: 'admin@jobfinder.com',
    role: 'Super Administrator',
    roleId: 1,
    status: 'Active',
    avatar: '👤',
    createdAt: '2024-01-01',
    lastLogin: new Date().toISOString().split('T')[0],
    customPermissions: [],
  })
  const [roles, setRoles] = useState<Role[]>(defaultRoles)
  const [loading, setLoading] = useState(true)

  const hasPermission = (permission: string): boolean => {
    const role = roles.find((r) => r.id === currentUser.roleId)
    if (!role) return false
    const [module, action] = permission.split(':')
    const hasRolePerm = role.permissions.some((p) => p.module === module && p.action === action)
    const hasCustomPerm = currentUser.customPermissions?.some((p) => p.module === module && p.action === action)
    return hasRolePerm || !!hasCustomPerm
  }

  const hasRole = (roleName: string): boolean => {
    return currentUser.role.toLowerCase().includes(roleName.toLowerCase())
  }

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`${API_BASE}/roles`)
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) setRoles(data)
        }
      } catch {
        // Use default roles
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, roles, hasPermission, hasRole, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
