'use client'

import { useEffect, useState } from 'react'
import { Input, Textarea } from '../components/Form'

const API_BASE = 'http://localhost:3001'

interface SiteSettings {
  siteName: string
  tagline: string
  heroTitle: string
  heroSubtitle: string
  contactEmail: string
  footerText: string
  maintenanceMode: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState<SiteSettings>({
    siteName: '',
    tagline: '',
    heroTitle: '',
    heroSubtitle: '',
    contactEmail: '',
    footerText: '',
    maintenanceMode: false,
  })

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`)
      const data = await res.json()
      setSettings(data)
      setFormData(data)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleChange = (name: string) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name as keyof SiteSettings] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      setSettings(formData)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (settings) {
      setFormData(settings)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Configure site-wide settings and appearance</p>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-800">Settings saved successfully</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Site Name" name="siteName" value={formData.siteName} onChange={handleInputChange} placeholder="JobFinder" required />
              <Input label="Tagline" name="tagline" value={formData.tagline} onChange={handleInputChange} placeholder="Find your dream career today" />
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Maintenance Mode</p>
                  <p className="text-xs text-gray-500 mt-0.5">Enable to show maintenance page to visitors</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleChange('maintenanceMode')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.maintenanceMode ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Hero Title" name="heroTitle" value={formData.heroTitle} onChange={handleInputChange} placeholder="Find Your Dream Job Today" required />
              <Textarea label="Hero Subtitle" name="heroSubtitle" value={formData.heroSubtitle} onChange={handleInputChange} placeholder="Browse thousands of job opportunities from top companies" rows={3} />
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact & Footer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Contact Email" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleInputChange} placeholder="contact@jobfinder.com" required />
              <Textarea label="Footer Text" name="footerText" value={formData.footerText} onChange={handleInputChange} placeholder="© 2024 JobFinder. All rights reserved." rows={2} />
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-800 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900">{formData.siteName || 'Site Name'}</h3>
                  <p className="text-xs text-gray-500 mt-1">{formData.tagline || 'Tagline'}</p>
                </div>
                <div className="mt-4 bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-xs font-semibold text-gray-900">{formData.heroTitle || 'Hero Title'}</p>
                  <p className="text-xs text-gray-500 mt-1">{formData.heroSubtitle || 'Hero subtitle text...'}</p>
                </div>
              </div>
              <div className="bg-gray-800 px-4 py-2">
                <p className="text-xs text-gray-400 text-center">{formData.footerText || 'Footer text...'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Site Info</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.maintenanceMode ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {formData.maintenanceMode ? 'Maintenance' : 'Live'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm text-gray-900">{formData.contactEmail || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">API</span>
                <span className="text-sm text-green-600 flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                  Connected
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-sm p-6 text-white">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-gray-300 mb-4">Check the documentation or contact support for assistance.</p>
            <a
              href="#"
              className="inline-flex items-center px-3 py-2 bg-white text-gray-900 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
