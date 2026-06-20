'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'

const API_BASE = 'http://localhost:3001'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [showExperienceForm, setShowExperienceForm] = useState(false)
  const [editingExperience, setEditingExperience] = useState(null)
  const [experienceForm, setExperienceForm] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
  })
  const [profileForm, setProfileForm] = useState({
    name: '',
    avatar: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    if (user.userType !== 'job_seeker') {
      router.push('/employer/dashboard')
      return
    }
    loadProfile()
  }, [user])

  const loadProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/landingpage/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      if (res.ok) {
        const data = await res.json()
        setProfileForm({ name: data.name || '', avatar: data.avatar || '' })
        setExperiences(data.experiences || [])
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch(`${API_BASE}/landingpage/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileForm),
      })
      await loadProfile()
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleExperienceSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editingExperience
        ? `${API_BASE}/landingpage/work-experiences/${editingExperience.id}`
        : `${API_BASE}/landingpage/work-experiences`
      const method = editingExperience ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(experienceForm),
      })

      setExperienceForm({ company: '', position: '', startDate: '', endDate: '', description: '' })
      setShowExperienceForm(false)
      setEditingExperience(null)
      await loadProfile()
    } catch (error) {
      console.error('Failed to save experience:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteExperience = async (id) => {
    if (!confirm('Are you sure you want to delete this experience?')) return
    try {
      await fetch(`${API_BASE}/landingpage/work-experiences/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      await loadProfile()
    } catch (error) {
      console.error('Failed to delete experience:', error)
    }
  }

  const startEditExperience = (exp) => {
    setEditingExperience(exp)
    setExperienceForm({
      company: exp.company || '',
      position: exp.position || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      description: exp.description || '',
    })
    setShowExperienceForm(true)
  }

  const cancelExperienceForm = () => {
    setShowExperienceForm(false)
    setEditingExperience(null)
    setExperienceForm({ company: '', position: '', startDate: '', endDate: '', description: '' })
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!user) return null

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'experiences', label: 'Work History', icon: '💼' },
    { id: 'resumes', label: 'Resumes', icon: '📄' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                {user.avatar || '👤'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500">{user.email}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  Job Seeker
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="max-w-xl space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <input
                    type="text"
                    value={user.createdAt || 'N/A'}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary py-3 px-6 rounded-xl font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {/* Work Experiences Tab */}
            {activeTab === 'experiences' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Work History</h2>
                  <button
                    onClick={() => setShowExperienceForm(true)}
                    className="btn-primary text-sm py-2 px-4 rounded-lg"
                  >
                    + Add Experience
                  </button>
                </div>

                {showExperienceForm && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      {editingExperience ? 'Edit Experience' : 'Add New Experience'}
                    </h3>
                    <form onSubmit={handleExperienceSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                          <input
                            type="text"
                            required
                            value={experienceForm.company}
                            onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                          <input
                            type="text"
                            required
                            value={experienceForm.position}
                            onChange={(e) => setExperienceForm({ ...experienceForm, position: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input
                            type="month"
                            required
                            value={experienceForm.startDate}
                            onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input
                            type="month"
                            value={experienceForm.endDate}
                            onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            placeholder="Leave empty if current"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={experienceForm.description}
                          onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={saving}
                          className="btn-primary text-sm py-2 px-4 rounded-lg disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : editingExperience ? 'Update' : 'Add'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelExperienceForm}
                          className="text-sm py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {experiences.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">💼</div>
                    <p className="text-gray-500">No work history yet</p>
                    <p className="text-gray-400 text-sm mt-1">Add your first work experience to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                            <p className="text-blue-600 text-sm">{exp.company}</p>
                            <p className="text-gray-400 text-sm mt-1">
                              {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : '- Present'}
                            </p>
                            {exp.description && (
                              <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditExperience(exp)}
                              className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="text-sm text-red-600 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Resumes Tab */}
            {activeTab === 'resumes' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">My Resumes</h2>
                  <a
                    href="/profile/resume-builder"
                    className="btn-primary text-sm py-2 px-4 rounded-lg"
                  >
                    + Create Resume
                  </a>
                </div>
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📄</div>
                  <p className="text-gray-500">No resumes created yet</p>
                  <p className="text-gray-400 text-sm mt-1">Build your first resume using our resume builder</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
