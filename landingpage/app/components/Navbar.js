'use client'

import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1H3zm1 2a1 1 0 011-1h5a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V6zm1 4a1 1 0 011-1h5a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zm8-4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V6zm0 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" />
            </svg>
            <span className="text-xl font-bold text-gray-900">JobBoard</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</a>
            <a href="/jobs" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Browse Jobs</a>
            <a href="/companies" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Companies</a>
            <a href="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">About</a>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <a
                  href={user.userType === 'employer' ? '/employer/dashboard' : '/profile'}
                  className="text-gray-600 hover:text-blue-600 font-medium text-sm"
                >
                  {user.name}
                </a>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="text-gray-600 hover:text-blue-600 font-medium text-sm">
                  Sign In
                </a>
                <a href="/register" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
