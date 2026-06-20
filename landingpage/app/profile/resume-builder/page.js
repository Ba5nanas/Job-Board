'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

const API_BASE = 'http://localhost:3001'

export default function ResumeBuilderPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resumeId, setResumeId] = useState(null)
  const [experiences, setExperiences] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    skills: '',
    education: '',
    certifications: '',
  })

  const [selectedExperiences, setSelectedExperiences] = useState([])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    loadUserData()
  }, [user])

  const loadUserData = async () => {
    try {
      const res = await fetch(`${API_BASE}/landingpage/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      if (res.ok) {
        const data = await res.json()
        setExperiences(data.experiences || [])
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleExperience = (expId) => {
    setSelectedExperiences((prev) => {
      if (prev.includes(expId)) {
        return prev.filter((id) => id !== expId)
      }
      return [...prev, expId]
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const selectedExpData = experiences.filter((exp) => selectedExperiences.includes(exp.id))

      const payload = {
        title: formData.title,
        summary: formData.summary,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        education: formData.education.split('\n').map((s) => s.trim()).filter(Boolean),
        certifications: formData.certifications.split(',').map((s) => s.trim()).filter(Boolean),
        experiences: selectedExpData,
      }

      const url = resumeId
        ? `${API_BASE}/landingpage/resumes/${resumeId}`
        : `${API_BASE}/landingpage/resumes`
      const method = resumeId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json()
        setResumeId(data.id)
        alert('Resume saved successfully!')
      }
    } catch (error) {
      console.error('Failed to save resume:', error)
      alert('Failed to save resume')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <a href="/profile" className="text-sm text-blue-600 hover:text-blue-700">
              ← Back to Profile
            </a>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Resume Builder</h1>
            <p className="text-gray-500 text-sm">Build and customize your professional resume</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary py-3 px-6 rounded-xl font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : resumeId ? '💾 Update Resume' : '💾 Save Resume'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resume Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g. Senior Developer Resume"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                  <textarea
                    rows={4}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    placeholder="Brief overview of your professional background and goals..."
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
              <textarea
                rows={3}
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="React, TypeScript, Node.js, Python (comma-separated)"
              />
              <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Education</h2>
              <textarea
                rows={4}
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="Each line is an education entry, e.g.:&#10;BSc Computer Science - MIT (2018-2022)&#10;MSc Data Science - Stanford (2022-2024)"
              />
              <p className="text-xs text-gray-400 mt-1">Enter each education entry on a new line</p>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h2>
              <textarea
                rows={3}
                value={formData.certifications}
                onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="AWS Certified, Google Analytics, PMP (comma-separated)"
              />
              <p className="text-xs text-gray-400 mt-1">Separate certifications with commas</p>
            </div>

            {/* Work Experience Selection */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Work Experience to Include
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Select experiences from your history to include in this resume
              </p>
              {experiences.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No work history available</p>
                  <a href="/profile" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
                    Add work experience in your profile
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <label
                      key={exp.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedExperiences.includes(exp.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedExperiences.includes(exp.id)}
                        onChange={() => handleToggleExperience(exp.id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{exp.position}</div>
                        <div className="text-sm text-blue-600">{exp.company}</div>
                        <div className="text-xs text-gray-400">
                          {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : '- Present'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
              <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {formData.title && (
                    <p className="text-sm text-blue-600 mt-1 font-medium">{formData.title}</p>
                  )}
                </div>

                {formData.summary && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Summary</h4>
                    <p className="text-xs text-gray-700">{formData.summary}</p>
                  </div>
                )}

                {formData.skills && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {formData.skills.split(',').filter(Boolean).map((skill, i) => (
                        <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedExperiences.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Experience</h4>
                    <div className="space-y-2">
                      {experiences
                        .filter((exp) => selectedExperiences.includes(exp.id))
                        .map((exp) => (
                          <div key={exp.id} className="text-xs">
                            <div className="font-medium text-gray-900">{exp.position}</div>
                            <div className="text-gray-600">{exp.company}</div>
                            <div className="text-gray-400">
                              {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : '- Present'}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {formData.education && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Education</h4>
                    <div className="space-y-1">
                      {formData.education.split('\n').filter(Boolean).map((edu, i) => (
                        <div key={i} className="text-xs text-gray-700">
                          {edu.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.certifications && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                      Certifications
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {formData.certifications.split(',').filter(Boolean).map((cert, i) => (
                        <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          {cert.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {!formData.title && !formData.summary && selectedExperiences.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    Start filling out the form to see your resume preview
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
