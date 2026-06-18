'use client'

import { useEffect, useState } from 'react'
import { Modal } from '../components/Modal'
import { Input, Select } from '../components/Form'

const API_BASE = 'http://localhost:3001'

interface FeaturedJob {
  id: number
  title: string
  company: string
  location: string
  type: string
  salary: string
  tags: string[]
  logo: string
  featured: boolean
}

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']
const emojis = ['🏢', '🚀', '🎨', '☁️', '📊', '📱', '🔧', '🎯', '💡', '🌐']

const emptyFeatured: Omit<FeaturedJob, 'id'> = {
  title: '',
  company: '',
  location: '',
  type: '',
  salary: '',
  tags: [],
  logo: '🏢',
  featured: true,
}

export default function FeaturedPage() {
  const [featuredJobs, setFeaturedJobs] = useState<FeaturedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<FeaturedJob | null>(null)
  const [formData, setFormData] = useState<Omit<FeaturedJob, 'id'>>(emptyFeatured)
  const [tagsInput, setTagsInput] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchFeatured = async () => {
    try {
      const res = await fetch(`${API_BASE}/featured`)
      const data = await res.json()
      setFeaturedJobs(data)
    } catch (error) {
      console.error('Failed to fetch featured jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeatured()
  }, [])

  const filteredJobs = featuredJobs.filter((job) => {
    return job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleOpenModal = (job?: FeaturedJob) => {
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
        featured: job.featured,
      })
      setTagsInput(job.tags.join(', '))
    } else {
      setEditingJob(null)
      setFormData(emptyFeatured)
      setTagsInput('')
    }
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingJob(null)
    setFormData(emptyFeatured)
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
    }

    try {
      if (editingJob) {
        await fetch(`${API_BASE}/featured/${editingJob.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch(`${API_BASE}/featured`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      handleCloseModal()
      fetchFeatured()
    } catch (error) {
      console.error('Failed to save featured job:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_BASE}/featured/${id}`, { method: 'DELETE' })
      setDeleteConfirm(null)
      fetchFeatured()
    } catch (error) {
      console.error('Failed to delete featured job:', error)
    }
  }

  const handleToggleFeatured = async (id: number) => {
    try {
      await fetch(`${API_BASE}/featured/${id}/toggle`, { method: 'POST' })
      fetchFeatured()
    } catch (error) {
      console.error('Failed to toggle featured:', error)
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Featured Jobs</h1>
          <p className="text-gray-500 mt-1">Manage featured job listings on homepage</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Featured Job
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search featured jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="text-2xl mr-3">{job.logo}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{job.title}</h3>
                  <p className="text-xs text-gray-500">{job.company}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeClass(job.type)}`}>
                {job.type}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L16.254 18.06a2 2 0 01-1.414.585H12a2 2 0 01-2-2V9a2 2 0 012-2h5a2 2 0 012 2v1.414a2 2 0 01-.586 1.414l-1.414 1.414z" />
              </svg>
              {job.location}
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {job.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleFeatured(job.id)}
                className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  job.featured
                    ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                {job.featured ? 'Featured' : 'Not Featured'}
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenModal(job)}
                  className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Edit
                </button>
                {deleteConfirm === job.id ? (
                  <span className="inline-flex items-center gap-1">
                    <button onClick={() => handleDelete(job.id)} className="text-xs text-red-600 hover:text-red-900">Confirm</button>
                    <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                  </span>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(job.id)}
                    className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No featured jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or add a new featured job.</p>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={editingJob ? 'Edit Featured Job' : 'Add Featured Job'}>
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
                    formData.logo === emoji ? 'bg-yellow-100 ring-2 ring-yellow-500' : 'bg-gray-100 hover:bg-gray-200'
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
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors">
              {editingJob ? 'Update Featured Job' : 'Create Featured Job'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
