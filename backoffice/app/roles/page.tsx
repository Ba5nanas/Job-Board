'use client'

import { useEffect, useState } from 'react'
import { Modal } from '../components/Modal'
import { Input, Select } from '../components/Form'

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

const permissionModules = [
  {
    name: 'Dashboard',
    key: 'dashboard',
    permissions: [{ action: 'view', label: 'View' }],
  },
  {
    name: 'Jobs',
    key: 'jobs',
    permissions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
  {
    name: 'Companies',
    key: 'companies',
    permissions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
  {
    name: 'Categories',
    key: 'categories',
    permissions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
  {
    name: 'Users',
    key: 'users',
    permissions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
  {
    name: 'Testimonials',
    key: 'testimonials',
    permissions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
  {
    name: 'Featured',
    key: 'featured',
    permissions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
  {
    name: 'Settings',
    key: 'settings',
    permissions: [
      { action: 'view', label: 'View' },
      { action: 'edit', label: 'Edit' },
    ],
  },
  {
    name: 'Roles',
    key: 'roles',
    permissions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
]

const allPermissions: Permission[] = permissionModules.flatMap((mod) =>
  mod.permissions.map((p) => ({ module: mod.key, action: p.action }))
)

const roleLevels = ['super_admin', 'admin', 'moderator', 'support']

const emptyRole: Omit<Role, 'id' | 'createdAt'> = {
  name: '',
  displayName: '',
  description: '',
  level: 'support',
  permissions: [],
}

const getLevelBadgeClass = (level: string) => {
  switch (level) {
    case 'super_admin':
      return 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
    case 'admin':
      return 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20'
    case 'moderator':
      return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
    case 'support':
      return 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
    default:
      return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'
  }
}

const getLevelLabel = (level: string) => {
  switch (level) {
    case 'super_admin':
      return 'Super Admin'
    case 'admin':
      return 'Admin'
    case 'moderator':
      return 'Moderator'
    case 'support':
      return 'Support'
    default:
      return level
  }
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState<Omit<Role, 'id' | 'createdAt'>>(emptyRole)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState('')

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_BASE}/roles`)
      const data = await res.json()
      setRoles(data)
    } catch (error) {
      console.error('Failed to fetch roles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = !filterLevel || role.level === filterLevel
    return matchesSearch && matchesLevel
  })

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role)
      setFormData({
        name: role.name,
        displayName: role.displayName,
        description: role.description,
        level: role.level,
        permissions: [...role.permissions],
      })
    } else {
      setEditingRole(null)
      setFormData(emptyRole)
    }
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingRole(null)
    setFormData(emptyRole)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const togglePermission = (module: string, action: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.find((p) => p.module === module && p.action === action)
      if (exists) {
        return {
          ...prev,
          permissions: prev.permissions.filter((p) => !(p.module === module && p.action === action)),
        }
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, { module, action }],
        }
      }
    })
  }

  const selectAllPermissions = () => {
    setFormData((prev) => ({ ...prev, permissions: [...allPermissions] }))
  }

  const deselectAllPermissions = () => {
    setFormData((prev) => ({ ...prev, permissions: [] }))
  }

  const isPermissionSelected = (module: string, action: string) => {
    return formData.permissions.some((p) => p.module === module && p.action === action)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      createdAt: editingRole ? editingRole.createdAt : new Date().toISOString().split('T')[0],
    }

    try {
      if (editingRole) {
        await fetch(`${API_BASE}/roles/${editingRole.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch(`${API_BASE}/roles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      handleCloseModal()
      fetchRoles()
    } catch (error) {
      console.error('Failed to save role:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_BASE}/roles/${id}`, { method: 'DELETE' })
      setDeleteConfirm(null)
      fetchRoles()
    } catch (error) {
      console.error('Failed to delete role:', error)
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
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-500 mt-1">Manage roles and their access permissions</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Role
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
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Levels</option>
            {roleLevels.map((level) => (
              <option key={level} value={level}>
                {getLevelLabel(level)}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{role.displayName}</div>
                      <div className="text-sm text-gray-500 font-mono">{role.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeClass(role.level)}`}>
                      {getLevelLabel(role.level)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{role.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {role.permissions?.length || 0} permissions
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(role)} className="text-blue-600 hover:text-blue-900 mr-3">
                      Edit
                    </button>
                    {deleteConfirm === role.id ? (
                      <span className="inline-flex items-center gap-1">
                        <button onClick={() => handleDelete(role.id)} className="text-red-600 hover:text-red-900 text-xs">Confirm</button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-gray-400 hover:text-gray-600 text-xs">Cancel</button>
                      </span>
                    ) : (
                      <button onClick={() => setDeleteConfirm(role.id)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRoles.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter.</p>
          </div>
        )}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredRoles.length}</span> of{' '}
            <span className="font-medium">{roles.length}</span> roles
          </p>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={editingRole ? 'Edit Role' : 'Add New Role'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Role Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="super_admin"
              required
            />
            <Input
              label="Display Name"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="Super Administrator"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleTextareaChange}
              placeholder="Describe this role..."
              rows={2}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <Select
            label="Level"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            options={roleLevels.map((l) => ({ value: l, label: getLevelLabel(l) }))}
            required
          />

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900">Permissions</h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAllPermissions}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={deselectAllPermissions}
                  className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {permissionModules.map((mod) => (
                <div key={mod.key} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{mod.name}</div>
                  <div className="flex flex-wrap gap-2">
                    {mod.permissions.map((perm) => (
                      <label
                        key={perm.action}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                          isPermissionSelected(mod.key, perm.action)
                            ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
                            : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isPermissionSelected(mod.key, perm.action)}
                          onChange={() => togglePermission(mod.key, perm.action)}
                          className="sr-only"
                        />
                        {isPermissionSelected(mod.key, perm.action) && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {perm.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formData.permissions.length} of {allPermissions.length} permissions selected
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingRole ? 'Update Role' : 'Create Role'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
