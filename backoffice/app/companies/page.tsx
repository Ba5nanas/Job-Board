'use client'

import { useEffect, useState } from 'react'
import { Modal } from '../components/Modal'
import { Input } from '../components/Form'

const API_BASE = 'http://localhost:3001'

interface Company {
  id: number
  name: string
  description?: string
  industry?: string
  location?: string
  website?: string
  status?: string
}

interface JobLimit {
  id: number
  companyId: number
  limit: number
  currentCount: number
  status: string
  upgradeStatus: string
  createdAt: string
  updatedAt: string
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [jobLimits, setJobLimits] = useState<JobLimit[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [limitModalOpen, setLimitModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [editingLimit, setEditingLimit] = useState<JobLimit | null>(null)
  const [formData, setFormData] = useState({ name: '' })
  const [limitFormData, setLimitFormData] = useState({ limit: 5, status: 'free' })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    try {
      const [companiesRes, limitsRes] = await Promise.all([
        fetch(`${API_BASE}/companies`),
        fetch(`${API_BASE}/job-limits`),
      ])
      const companiesData = await companiesRes.json()
      const limitsData = await limitsRes.json()
      setCompanies(companiesData)
      setJobLimits(limitsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getJobLimitForCompany = (companyId: number): JobLimit | undefined => {
    return jobLimits.find((jl) => jl.companyId === companyId)
  }

  const handleOpenModal = (company?: Company) => {
    if (company) {
      setEditingCompany(company)
      setFormData({ name: company.name })
    } else {
      setEditingCompany(null)
      setFormData({ name: '' })
    }
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingCompany(null)
    setFormData({ name: '' })
  }

  const handleOpenLimitModal = (company: Company) => {
    const existingLimit = getJobLimitForCompany(company.id)
    if (existingLimit) {
      setEditingLimit(existingLimit)
      setLimitFormData({ limit: existingLimit.limit, status: existingLimit.status })
    } else {
      setEditingLimit(null)
      setLimitFormData({ limit: 5, status: 'free' })
    }
    setEditingCompany(company)
    setLimitModalOpen(true)
  }

  const handleCloseLimitModal = () => {
    setLimitModalOpen(false)
    setEditingLimit(null)
    setEditingCompany(null)
    setLimitFormData({ limit: 5, status: 'free' })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCompany) {
        await fetch(`${API_BASE}/companies/${editingCompany.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      } else {
        await fetch(`${API_BASE}/companies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      }
      handleCloseModal()
      fetchData()
    } catch (error) {
      console.error('Failed to save company:', error)
    }
  }

  const handleSubmitLimit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCompany) return
    try {
      if (editingLimit) {
        await fetch(`${API_BASE}/job-limits/${editingLimit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyId: editingCompany.id,
            limit: limitFormData.limit,
            status: limitFormData.status,
            currentCount: editingLimit.currentCount,
            upgradeStatus: editingLimit.upgradeStatus,
            updatedAt: new Date().toISOString().split('T')[0],
          }),
        })
      } else {
        await fetch(`${API_BASE}/job-limits`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyId: editingCompany.id,
            limit: limitFormData.limit,
            status: limitFormData.status,
            currentCount: 0,
            upgradeStatus: 'none',
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
          }),
        })
      }
      handleCloseLimitModal()
      fetchData()
    } catch (error) {
      console.error('Failed to save job limit:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_BASE}/companies/${id}`, { method: 'DELETE' })
      setDeleteConfirm(null)
      fetchData()
    } catch (error) {
      console.error('Failed to delete company:', error)
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
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-500 mt-1">Manage registered companies and job limits</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Company
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map((company) => {
                const jobLimit = getJobLimitForCompany(company.id)
                return (
                  <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{company.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {jobLimit ? jobLimit.limit : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {jobLimit ? (
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                (jobLimit.currentCount / jobLimit.limit) >= 0.9
                                  ? 'bg-red-500'
                                  : (jobLimit.currentCount / jobLimit.limit) >= 0.7
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((jobLimit.currentCount / jobLimit.limit) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {jobLimit.currentCount}/{jobLimit.limit}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {jobLimit ? (
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            jobLimit.status === 'premium'
                              ? 'bg-purple-100 text-purple-700'
                              : jobLimit.status === 'pro'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {jobLimit.status}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleOpenModal(company)} className="text-blue-600 hover:text-blue-900 mr-3">
                        Edit
                      </button>
                      <button onClick={() => handleOpenLimitModal(company)} className="text-purple-600 hover:text-purple-900 mr-3">
                        Job Limit
                      </button>
                      {deleteConfirm === company.id ? (
                        <span className="inline-flex items-center gap-1">
                          <button onClick={() => handleDelete(company.id)} className="text-red-600 hover:text-red-900 text-xs">Confirm</button>
                          <button onClick={() => setDeleteConfirm(null)} className="text-gray-400 hover:text-gray-600 text-xs">Cancel</button>
                        </span>
                      ) : (
                        <button onClick={() => setDeleteConfirm(company.id)} className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No companies found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or add a new company.</p>
          </div>
        )}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredCompanies.length}</span> of{' '}
            <span className="font-medium">{companies.length}</span> companies
          </p>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={editingCompany ? 'Edit Company' : 'Add New Company'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Company Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter company name" required />
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
              {editingCompany ? 'Update Company' : 'Create Company'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={limitModalOpen} onClose={handleCloseLimitModal} title={`Job Limit - ${editingCompany?.name}`}>
        <form onSubmit={handleSubmitLimit} className="space-y-4">
          <Input
            label="Max Jobs Allowed"
            name="limit"
            type="number"
            value={String(limitFormData.limit)}
            onChange={(e) => setLimitFormData({ ...limitFormData, limit: parseInt(e.target.value) || 0 })}
            placeholder="Enter job limit"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Status</label>
            <select
              value={limitFormData.status}
              onChange={(e) => setLimitFormData({ ...limitFormData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleCloseLimitModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
              {editingLimit ? 'Update Limit' : 'Set Limit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
