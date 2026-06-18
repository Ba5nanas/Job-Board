'use client'

import { useEffect, useState } from 'react'
import { Modal } from '../components/Modal'
import { Input, Select } from '../components/Form'
import { useAuth, Permission, Role } from '../contexts/AuthContext'

const API_BASE = 'http://localhost:3001'

const permissionModules = [
  { name: 'Dashboard', key: 'dashboard', permissions: [{ action: 'view', label: 'View' }] },
  { name: 'Jobs', key: 'jobs', permissions: [{ action: 'view', label: 'View' }, { action: 'create', label: 'Create' }, { action: 'edit', label: 'Edit' }, { action: 'delete', label: 'Delete' }] },
  { name: 'Companies', key: 'companies', permissions: [{ action: 'view', label: 'View' }, { action: 'create', label: 'Create' }, { action: 'edit', label: 'Edit' }, { action: 'delete', label: 'Delete' }] },
  { name: 'Categories', key: 'categories', permissions: [{ action: 'view', label: 'View' }, { action: 'create', label: 'Create' }, { action: 'edit', label: 'Edit' }, { action: 'delete', label: 'Delete' }] },
  { name: 'Users', key: 'users', permissions: [{ action: 'view', label: 'View' }, { action: 'create', label: 'Create' }, { action: 'edit', label: 'Edit' }, { action: 'delete', label: 'Delete' }] },
  { name: 'Testimonials', key: 'testimonials', permissions: [{ action: 'view', label: 'View' }, { action: 'create', label: 'Create' }, { action: 'edit', label: 'Edit' }, { action: 'delete', label: 'Delete' }] },
  { name: 'Featured', key: 'featured', permissions: [{ action: 'view', label: 'View' }, { action: 'create', label: 'Create' }, { action: 'edit', label: 'Edit' }, { action: 'delete', label: 'Delete' }] },
  { name: 'Settings', key: 'settings', permissions: [{ action: 'view', label: 'View' }, { action: 'edit', label: 'Edit' }] },
  { name: 'Roles', key: 'roles', permissions: [{ action: 'view', label: 'View' }, { action: 'create', label: 'Create' }, { action: 'edit', label: 'Edit' }, { action: 'delete', label: 'Delete' }] },
]

const allPermissions: Permission[] = permissionModules.flatMap((mod) => mod.permissions.map((p) => ({ module: mod.key, action: p.action })))

const getLevelBadgeClass = (level: string) => {
  switch (level) {
    case 'super_admin': return 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
    case 'admin': return 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20'
    case 'moderator': return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
    case 'support': return 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
    default: return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'
  }
}

interface User {
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
  permissionCount?: number
}

const roles = ['Job Seeker', 'Employer', 'Admin']
const statuses = ['Active', 'Inactive', 'Suspended']
const avatars = ['👤', '👨', '👩', '👨‍💻', '👩‍💼', '🧑', '👩‍🎨', '🏢']

const emptyUser: Omit<User, 'id' | 'createdAt'> = {
  name: '',
  email: '',
  role: 'Job Seeker',
  roleId: undefined,
  status: 'Active',
  avatar: '👤',
  lastLogin: 'Never',
  customPermissions: [],
  permissionCount: 0,
}

export default function UsersPage() {
  const { roles: authRoles } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<Omit<User, 'id' | 'createdAt'>>(emptyUser)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [permDetailOpen, setPermDetailOpen] = useState<User | null>(null)
  const [availableRoles, setAvailableRoles] = useState<Role[]>([])

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`)
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${API_BASE}/roles`)
        const data = await res.json()
        if (data.length > 0) setAvailableRoles(data)
      } catch {
        // Use auth context roles if API fails
        if (authRoles.length > 0) setAvailableRoles(authRoles)
      }
    }
    fetchRoles()
  }, [authRoles])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !filterRole || user.role === filterRole
    const matchesStatus = !filterStatus || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        roleId: user.roleId,
        status: user.status,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        customPermissions: user.customPermissions ? [...user.customPermissions] : [],
        permissionCount: user.permissionCount,
      })
    } else {
      setEditingUser(null)
      setFormData(emptyUser)
    }
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingUser(null)
    setFormData(emptyUser)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'roleId') {
      const roleId = value ? Number(value) : undefined
      const selectedRole = availableRoles.find((r) => r.id === roleId)
      setFormData((prev) => ({
        ...prev,
        roleId,
        role: selectedRole?.displayName || '',
        customPermissions: [],
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const toggleCustomPermission = (module: string, action: string) => {
    setFormData((prev) => {
      const current = prev.customPermissions || []
      const exists = current.find((p) => p.module === module && p.action === action)
      if (exists) {
        return { ...prev, customPermissions: current.filter((p) => !(p.module === module && p.action === action)) }
      } else {
        return { ...prev, customPermissions: [...current, { module, action }] }
      }
    })
  }

  const getRolePermissions = (roleId?: number): Permission[] => {
    if (!roleId) return []
    const role = availableRoles.find((r) => r.id === roleId)
    return role?.permissions || []
  }

  const hasPermission = (roleId: number | undefined, module: string, action: string, customPerms: Permission[] = []): boolean => {
    const rolePerms = getRolePermissions(roleId)
    const hasRolePerm = rolePerms.some((p) => p.module === module && p.action === action)
    const hasCustomPerm = customPerms.some((p) => p.module === module && p.action === action)
    return hasRolePerm || hasCustomPerm
  }

  const getTotalPermissionCount = (user: User): number => {
    const rolePerms = getRolePermissions(user.roleId)
    const customPerms = user.customPermissions || []
    const combined = new Set<string>()
    rolePerms.forEach((p) => combined.add(`${p.module}:${p.action}`))
    customPerms.forEach((p) => combined.add(`${p.module}:${p.action}`))
    return combined.size
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString().split('T')[0],
    }

    try {
      if (editingUser) {
        await fetch(`${API_BASE}/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch(`${API_BASE}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      handleCloseModal()
      fetchUsers()
    } catch (error) {
      console.error('Failed to save user:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' })
      setDeleteConfirm(null)
      fetchUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-700'
      case 'Inactive':
        return 'bg-gray-50 text-gray-700'
      case 'Suspended':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-50 text-red-700'
      case 'Employer':
        return 'bg-blue-50 text-blue-700'
      case 'Job Seeker':
        return 'bg-purple-50 text-purple-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage all registered users</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-xl mr-3">{user.avatar}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {getTotalPermissionCount(user)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => setPermDetailOpen(user)} className="text-indigo-600 hover:text-indigo-900 mr-3" title="View Permissions">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </button>
                    <button onClick={() => handleOpenModal(user)} className="text-blue-600 hover:text-blue-900 mr-3">
                      Edit
                    </button>
                    {deleteConfirm === user.id ? (
                      <span className="inline-flex items-center gap-1">
                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 text-xs">Confirm</button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-gray-400 hover:text-gray-600 text-xs">Cancel</button>
                      </span>
                    ) : (
                      <button onClick={() => setDeleteConfirm(user.id)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter.</p>
          </div>
        )}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
            <span className="font-medium">{users.length}</span> users
          </p>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={editingUser ? 'Edit User' : 'Add New User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" required />
            <Input label="Email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" type="email" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Role" name="role" value={formData.role} onChange={handleInputChange} options={roles.map((r) => ({ value: r, label: r }))} required />
            <Select label="Status" name="status" value={formData.status} onChange={handleInputChange} options={statuses.map((s) => ({ value: s, label: s }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
            <div className="flex flex-wrap gap-2">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, avatar }))}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors ${
                    formData.avatar === avatar ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Permissions</h4>
            <Select
              label="Assign Role"
              name="roleId"
              value={formData.roleId?.toString() || ''}
              onChange={handleInputChange}
              options={availableRoles.map((r) => ({ value: r.id.toString(), label: `${r.displayName} (${r.permissions?.length || 0} perms)` }))}
            />

            {formData.roleId && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Inherited permissions from role (read-only):</p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                  {getRolePermissions(formData.roleId).map((p, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
                      <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {p.module}:{p.action}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Grant additional custom permissions:</p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {permissionModules.map((mod) => (
                  <div key={mod.key} className="bg-gray-50 rounded-lg p-2">
                    <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">{mod.name}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {mod.permissions.map((perm) => {
                        const isCustom = (formData.customPermissions || []).some((p) => p.module === mod.key && p.action === perm.action)
                        const isRolePerm = getRolePermissions(formData.roleId).some((p) => p.module === mod.key && p.action === perm.action)
                        const isActive = isCustom || isRolePerm
                        return (
                          <label
                            key={perm.action}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                              isCustom
                                ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
                                : isRolePerm
                                  ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
                                  : 'bg-white text-gray-500 ring-1 ring-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isCustom}
                              onChange={() => toggleCustomPermission(mod.key, perm.action)}
                              className="sr-only"
                            />
                            {isActive && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            {perm.label}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {(() => {
                  const rolePerms = getRolePermissions(formData.roleId)
                  const customPerms = formData.customPermissions || []
                  const combined = new Set<string>()
                  rolePerms.forEach((p) => combined.add(`${p.module}:${p.action}`))
                  customPerms.forEach((p) => combined.add(`${p.module}:${p.action}`))
                  return combined.size
                })()} total permissions
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              {editingUser ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!permDetailOpen} onClose={() => setPermDetailOpen(null)} title="User Permissions Detail">
        {permDetailOpen && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl">{permDetailOpen.avatar}</div>
              <div>
                <div className="font-medium text-gray-900">{permDetailOpen.name}</div>
                <div className="text-sm text-gray-500">{permDetailOpen.email}</div>
              </div>
              <div className="ml-auto">
                {(() => {
                  const role = availableRoles.find((r) => r.id === permDetailOpen.roleId)
                  return role ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeClass(role.level)}`}>
                      {role.displayName}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      No Role
                    </span>
                  )
                })()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {permissionModules.map((mod) => {
                const rolePerms = getRolePermissions(permDetailOpen.roleId)
                const customPerms = permDetailOpen.customPermissions || []
                return (
                  <div key={mod.key} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{mod.name}</div>
                    <div className="space-y-1.5">
                      {mod.permissions.map((perm) => {
                        const hasRole = rolePerms.some((p) => p.module === mod.key && p.action === perm.action)
                        const hasCustom = customPerms.some((p) => p.module === mod.key && p.action === perm.action)
                        const active = hasRole || hasCustom
                        return (
                          <div key={perm.action} className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">{perm.label}</span>
                            {active ? (
                              <span className="inline-flex items-center gap-0.5 text-xs text-emerald-600">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {hasRole ? 'Role' : 'Custom'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 text-xs text-gray-400">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                None
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setPermDetailOpen(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
