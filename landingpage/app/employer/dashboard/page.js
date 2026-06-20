'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

const API_BASE = 'http://localhost:3001'

export default function EmployerDashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [company, setCompany] = useState(null)
  const [companyUser, setCompanyUser] = useState(null)
  const [jobLimit, setJobLimit] = useState(null)
  const [companyJobs, setCompanyJobs] = useState([])
  const [members, setMembers] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [editingCompany, setEditingCompany] = useState(false)
  const [companyForm, setCompanyForm] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    website: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    if (user.userType !== 'employer') {
      router.push('/profile')
      return
    }
    loadDashboard()
  }, [user])

  const loadDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/landingpage/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      if (res.ok) {
        const data = await res.json()
        setCompany(data.company || null)
        setCompanyUser(data.companyUser || null)
        setJobLimit(data.jobLimit || null)
        setCompanyJobs(data.companyJobs || [])
        setMembers(data.members || [])
        if (data.company) {
          setCompanyForm({
            name: data.company.name || '',
            description: data.company.description || '',
            industry: data.company.industry || '',
            location: data.company.location || '',
            website: data.company.website || '',
          })
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCompany = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch(`${API_BASE}/landingpage/company`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(companyForm),
      })
      setEditingCompany(false)
      await loadDashboard()
    } catch (error) {
      console.error('Failed to save company:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!user) return null

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'company', label: 'Company Info', icon: '🏢' },
    { id: 'jobs', label: 'My Jobs', icon: '💼' },
    { id: 'members', label: 'Team', icon: '👥' },
  ]

  const isOwner = companyUser?.role === 'owner'

  const roleLabels = {
    owner: 'Owner',
    hr: 'HR Manager',
    recruiter: 'Recruiter',
  }

  const remainingJobs = jobLimit ? jobLimit.limit - jobLimit.currentCount : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                🏢
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {company?.name || 'Company'}
                </h1>
                <p className="text-gray-500">{user.name} • {roleLabels[companyUser?.role] || companyUser?.role}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    Employer
                  </span>
                  {companyUser?.role === 'owner' && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      Owner
                    </span>
                  )}
                </div>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                💼
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{companyJobs.length}</p>
                <p className="text-sm text-gray-500">Active Jobs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-xl">
                📊
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {remainingJobs}/{jobLimit?.limit || 0}
                </p>
                <p className="text-sm text-gray-500">Jobs Remaining</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
                👥
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{members.length}</p>
                <p className="text-sm text-gray-500">Team Members</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Limit Warning */}
        {remainingJobs <= 2 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-medium text-amber-800">Job limit almost reached</p>
              <p className="text-sm text-amber-600">
                You have {remainingJobs} slot{remainingJobs !== 1 ? 's' : ''} remaining. Consider upgrading your plan.
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-xl p-5">
                    <h3 className="font-medium text-gray-900 mb-3">Company Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Name</span>
                        <span className="text-gray-900">{company?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Industry</span>
                        <span className="text-gray-900">{company?.industry || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Location</span>
                        <span className="text-gray-900">{company?.location || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status</span>
                        <span className="text-green-600">{company?.status || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-5">
                    <h3 className="font-medium text-gray-900 mb-3">Job Posting Plan</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Plan</span>
                        <span className="text-gray-900 capitalize">{jobLimit?.status || 'free'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Limit</span>
                        <span className="text-gray-900">{jobLimit?.limit || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Used</span>
                        <span className="text-gray-900">{jobLimit?.currentCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Remaining</span>
                        <span className="text-gray-900">{remainingJobs}</span>
                      </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${jobLimit ? (jobLimit.currentCount / jobLimit.limit) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Company Info Tab */}
            {activeTab === 'company' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
                  {isOwner && !editingCompany && (
                    <button
                      onClick={() => setEditingCompany(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50"
                    >
                      ✏️ Edit Company
                    </button>
                  )}
                </div>

                {editingCompany ? (
                  <form onSubmit={handleSaveCompany} className="max-w-xl space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={companyForm.name}
                        onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                      <textarea
                        rows={4}
                        value={companyForm.description}
                        onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                        <input
                          type="text"
                          value={companyForm.industry}
                          onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={companyForm.location}
                          onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        value={companyForm.website}
                        onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary py-3 px-6 rounded-xl font-medium disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCompany(false)}
                        className="text-sm py-3 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="max-w-xl">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
                        <p className="text-gray-900 font-medium mt-1">{company?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">About</h3>
                        <p className="text-gray-900 mt-1">{company?.description || 'No description yet'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Industry</h3>
                          <p className="text-gray-900 mt-1">{company?.industry || 'N/A'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Location</h3>
                          <p className="text-gray-900 mt-1">{company?.location || 'N/A'}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Website</h3>
                        <p className="text-gray-900 mt-1">
                          {company?.website ? (
                            <a href={company.website} target="_blank" className="text-blue-600 hover:underline">
                              {company.website}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">My Job Postings</h2>
                  <button className="btn-primary text-sm py-2 px-4 rounded-lg">
                    + Post New Job
                  </button>
                </div>
                {companyJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">💼</div>
                    <p className="text-gray-500">No jobs posted yet</p>
                    <p className="text-gray-400 text-sm mt-1">Start posting jobs to attract candidates</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {companyJobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{job.title}</h3>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                              <span>📍 {job.location}</span>
                              <span>💰 {job.salary}</span>
                              <span>📅 {job.posted}</span>
                            </div>
                            <div className="flex gap-2 mt-3">
                              {job.tags?.map((tag, i) => (
                                <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              job.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {job.status || 'active'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                  {isOwner && (
                    <button className="btn-primary text-sm py-2 px-4 rounded-lg">
                      + Add Member
                    </button>
                  )}
                </div>
                {members.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">👥</div>
                    <p className="text-gray-500">No team members yet</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {isOwner ? 'Invite HR and recruiters to your team' : 'Waiting for owner to add members'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {members.map((member) => (
                      <div key={member.id} className="border border-gray-200 rounded-xl p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            👤
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">User #{member.userId}</p>
                            <p className="text-sm text-gray-500">
                              <span className="capitalize">{member.role}</span> • {member.status}
                            </p>
                          </div>
                        </div>
                        {isOwner && member.id !== companyUser?.id && (
                          <div className="flex gap-2">
                            <button className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-50">
                              Edit
                            </button>
                            <button className="text-sm text-red-600 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50">
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
