'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'

export default function RegisterPage() {
  const [role, setRole] = useState('job_seeker')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [companyIndustry, setCompanyIndustry] = useState('')
  const [companyLocation, setCompanyLocation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { registerJobSeeker, registerEmployer } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (role === 'employer' && !companyName.trim()) {
      setError('Company name is required')
      return
    }

    setLoading(true)

    try {
      if (role === 'job_seeker') {
        await registerJobSeeker(name, email, password)
      } else {
        await registerEmployer(name, email, password, companyName, companyDescription, companyIndustry, companyLocation)
      }
      router.push('/login')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join JobBoard today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('job_seeker')}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  role === 'job_seeker'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="text-2xl mb-2">👤</div>
                <div className="font-medium text-sm">Job Seeker</div>
                <div className="text-xs text-gray-500 mt-1">Find your dream job</div>
              </button>
              <button
                type="button"
                onClick={() => setRole('employer')}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  role === 'employer'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="text-2xl mb-2">🏢</div>
                <div className="font-medium text-sm">Employer</div>
                <div className="text-xs text-gray-500 mt-1">Hire top talent</div>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Repeat your password"
              />
            </div>

            {role === 'employer' && (
              <>
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Company Information</h3>
                </div>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    required={role === 'employer'}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    About Company
                  </label>
                  <textarea
                    id="companyDescription"
                    rows={3}
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us about your company..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="companyIndustry" className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <input
                      id="companyIndustry"
                      type="text"
                      value={companyIndustry}
                      onChange={(e) => setCompanyIndustry(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Technology"
                    />
                  </div>
                  <div>
                    <label htmlFor="companyLocation" className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      id="companyLocation"
                      type="text"
                      value={companyLocation}
                      onChange={(e) => setCompanyLocation(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Bangkok, Thailand"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
