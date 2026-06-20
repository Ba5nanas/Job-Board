'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

const API_BASE = 'http://localhost:3001'

export default function CompanyMembersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState([])
  const [companyUser, setCompanyUser] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    role: 'recruiter',
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    if (user.userType !== 'employer') {
      router.push('/profile')
      return
    }
    loadMembers()
  }, [user])

  const loadMembers = async () => {
    try {
      const res = await fetch(`${API_BASE}/landingpage/company/members`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      if (res.ok) {
        const data = await res.json()
        setMembers(data || [])
        const currentUser = data.find((m) => m.userId === user.id)
        setCompanyUser(currentUser || null)
      }
    } catch (error) {
      console.error('Failed to load members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch(`${API_BASE}/landingpage/company/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      })
      setShowAddModal(false)
      setFormData({ email: '', role: 'recruiter' })
      await loadMembers()
    } catch (error) {
      console.error('Failed to add member:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleEditMember = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch(`${API_BASE}/landingpage/company/members/${editingMember.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role: formData.role, status: formData.status }),
      })
      setShowEditModal(false)
      setEditingMember(null)
      setFormData({ email: '', role: 'recruiter' })
      await loadMembers()
    } catch (error) {
      console.error('Failed to update member:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member?')) return
    try {
      await fetch(`${API_BASE}/landingpage/company/members/${memberId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      await loadMembers()
    } catch (error) {
      console.error('Failed to remove member:', error)
    }
  }

  const openEditModal = (member) => {
    setEditingMember(member)
    setFormData({
      role: member.role,
      status: member.status,
    })
    setShowEditModal(true)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!user) return null

  const isOwner = companyUser?.role === 'owner'

  const roleLabels = {
    owner: 'Owner',
    hr: 'HR Manager',
    recruiter: 'Recruiter',
  }

  const roleColors = {
    owner: 'bg-amber-100 text-amber-700',
    hr: 'bg-purple-100 text-purple-700',
    recruiter: 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <a href="/employer/dashboard" className="text-sm text-blue-600 hover:text-blue-700">
              ← Back to Dashboard
            </a>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Team Members</h1>
            <p className="text-gray-500 text-sm">Manage your company team and permissions</p>
          </div>
          {isOwner && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary py-3 px-6 rounded-xl font-medium"
            >
              + Add Member
            </button>
          )}
        </div>

        {/* Role Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  Owner
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Full access to company settings, manage team members, and control job postings.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  HR Manager
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Manage job postings, review applications, and handle candidate communications.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  Recruiter
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Post jobs within limits and manage candidate applications.
              </p>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Team</h2>
            {members.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">👥</div>
                <p className="text-gray-500">No team members yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  {isOwner ? 'Add your first team member to get started' : 'Waiting for owner to add members'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                        👤
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">
                            Member #{member.userId}
                            {member.userId === user.id && (
                              <span className="text-xs text-gray-400">(You)</span>
                            )}
                          </p>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              roleColors[member.role] || 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {roleLabels[member.role] || member.role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{member.status}</p>
                      </div>
                    </div>
                    {isOwner && member.userId !== user.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(member)}
                          className="text-sm text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-sm text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Member Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Team Member</h3>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="member@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    >
                      <option value="hr">HR Manager</option>
                      <option value="recruiter">Recruiter</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary flex-1 py-3 px-6 rounded-xl font-medium disabled:opacity-50"
                    >
                      {saving ? 'Adding...' : 'Add Member'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="text-sm py-3 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Member Modal */}
        {showEditModal && editingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Member</h3>
                <form onSubmit={handleEditMember} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    >
                      <option value="owner">Owner</option>
                      <option value="hr">HR Manager</option>
                      <option value="recruiter">Recruiter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status || 'Active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary flex-1 py-3 px-6 rounded-xl font-medium disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false)
                        setEditingMember(null)
                      }}
                      className="text-sm py-3 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
