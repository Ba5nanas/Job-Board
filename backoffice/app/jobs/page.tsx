'use client'

import { useEffect, useState } from 'react'
import { Modal } from '../components/Modal'
import { Input, Select } from '../components/Form'

const API_BASE = 'http://localhost:3001'

interface Job {
  id: number
  title: string
  company: string
  location: string
  type: string
  salary: string
  tags: string[]
  posted: string
  logo: string
}

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']
const emojis = ['🏢', '🚀', '🎨', '☁️', '📊', '📱', '🔧', '🎯', '💡', '🌐']

const emptyJob: Omit<Job, 'id' | 'posted'> = {
  title: '',
  company: '',
  location: '',
  type: '',
  salary: '',
  tags: [],
  logo: '🏢',
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [formData, setFormData] = useState<Omit<Job, 'id' | 'posted'>>(emptyJob)
  const [tagsInput, setTagsInput] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE}/jobs`)
      const data = await res.json()
      setJobs(data)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || job.type === filterType
    return matchesSearch && matchesType
  })

  const handleOpenModal = (job?: Job) => {
    if (job) {
      setEditingJob(job)
      setFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salary: job.salary,
        tags: job.tags,
        logo: job.logo,
      })
      setTagsInput(job.tags.join(', '))
    } else {
      setEditingJob(null)
      setFormData(emptyJob)
      setTagsInput('')
    }
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingJob(null)
    setFormData(emptyJob)
    setTagsInput('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    const payload = {
      ...formData,
      tags,
      posted: editingJob ? editingJob.posted : 'Just now',
    }

    try {
      if (editingJob) {
        await fetch(`${API_BASE}/jobs/${editingJob.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch(`${API_BASE}/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      handleCloseModal()
      fetchJobs()
    } catch (error) {
      console.error('Failed to save job:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_BASE}/jobs/${id}`, { method: 'DELETE' })
      setDeleteConfirm(null)
      fetchJobs()
    } catch (error) {
      console.error('Failed to delete job:', error)
    }
  }

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'bg-blue-50 text-blue-700'
      case 'Part-time':
        return 'bg-green-50 text-green-700'
      case 'Contract':
        return 'bg-purple-50 text-purple-700'
      case 'Freelance':
        return 'bg-orange-50 text-orange-700'
      case 'Internship':
        return 'bg-pink-50 text-pink-700'
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
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-500 mt-1">Manage all job listings</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Job
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
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-xl mr-3">{job.logo}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeClass(job.type)}`}>
                      {job.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.salary}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.posted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(job)} className="text-blue-600 hover:text-blue-900 mr-3">
                      Edit
                    </button>
                    {deleteConfirm === job.id ? (
                      <span className="inline-flex items-center gap-1">
                        <button onClick={() => handleDelete(job.id)} className="text-red-600 hover:text-red-900 text-xs">Confirm</button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-gray-400 hover:text-gray-600 text-xs">Cancel</button>
                      </span>
                    ) : (
                      <button onClick={() => setDeleteConfirm(job.id)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter.</p>
          </div>
        )}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredJobs.length}</span> of{' '}
            <span className="font-medium">{jobs.length}</span> jobs
          </p>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={editingJob ? 'Edit Job' : 'Add New Job'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Senior Developer" required />
            <Input label="Company" name="company" value={formData.company} onChange={handleInputChange} placeholder="TechCorp" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Location" name="location" value={formData.location} onChange={handleInputChange} placeholder="Bangkok, Thailand" required />
            <Select label="Type" name="type" value={formData.type} onChange={handleInputChange} options={jobTypes.map((t) => ({ value: t, label: t }))} required />
          </div>
          <Input label="Salary" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="฿80,000 - ฿120,000" required />
          <Input label="Tags (comma separated)" name="tagsInput" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="React, TypeScript, Next.js" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo Emoji</label>
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, logo: emoji }))}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors ${
                    formData.logo === emoji ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              {editingJob ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
