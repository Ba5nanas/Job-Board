'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const API_BASE = 'http://localhost:3001'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const login = useCallback(async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.message || 'Login failed')
      }
      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      return data.access_token
    } catch (error) {
      throw error
    }
  }, [])

  const registerJobSeeker = useCallback(async (name, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/landingpage/register/job-seeker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.message || 'Registration failed')
      }
      return res.json()
    } catch (error) {
      throw error
    }
  }, [])

  const registerEmployer = useCallback(async (name, email, password, companyName, companyDescription, companyIndustry, companyLocation) => {
    try {
      const res = await fetch(`${API_BASE}/landingpage/register/employer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, companyName, companyDescription, companyIndustry, companyLocation }),
      })
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.message || 'Registration failed')
      }
      return res.json()
    } catch (error) {
      throw error
    }
  }, [])

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const res = await fetch(`${API_BASE}/landingpage/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        localStorage.removeItem('token')
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return (
    <AuthContext.Provider value={{ user, loading, login, registerJobSeeker, registerEmployer, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
