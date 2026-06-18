'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const API_BASE = 'http://localhost:3001'

interface Stats {
  jobs: number
  companies: number
  categories: number
  users: number
  totalJobsCount: number
}

interface RecentJob {
  id: number
  title: string
  company: string
  location: string
  type: string
  posted: string
  logo: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ jobs: 0, companies: 0, categories: 0, users: 0, totalJobsCount: 0 })
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, companiesRes, categoriesRes, usersRes] = await Promise.all([
          fetch(`${API_BASE}/jobs`),
          fetch(`${API_BASE}/companies`),
          fetch(`${API_BASE}/categories`),
          fetch(`${API_BASE}/users`),
        ])
        const jobs = await jobsRes.json()
        const companies = await companiesRes.json()
        const categories = await categoriesRes.json()
        const users = await usersRes.json()
        const totalJobsCount = categories.reduce((sum: number, cat: any) => sum + cat.count, 0)
        setStats({
          jobs: jobs.length,
          companies: companies.length,
          categories: categories.length,
          users: users.length,
          totalJobsCount,
        })
        setRecentJobs(jobs.slice(0, 5))
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { label: 'Active Jobs', value: stats.jobs, icon: 'M21 13.255A23.931 23.931 0 0115 13c-2.635 0-5.153.481-7.469 1.355A19.92 19.92 0 013 13m18 0c-.861.69-1.83 1.265-2.862 1.705a19.92 19.92 0 01-12.276 0C6.13 14.265 5.161 13.69 4.3 13m18 0c.861.69 1.83 1.265 2.862 1.705a19.92 19.92 0 0012.276 0c1.032.44 2.001 1.015 2.862 1.705M3 20c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v0a2 2 0 01-2 2H5a2 2 0 01-2-2v0z', color: 'bg-blue-500', lightBg: 'bg-blue-50', href: '/jobs' },
    { label: 'Companies', value: stats.companies, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'bg-green-500', lightBg: 'bg-green-50', href: '/companies' },
    { label: 'Categories', value: stats.categories, icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z', color: 'bg-purple-500', lightBg: 'bg-purple-50', href: '/categories' },
    { label: 'Total Listings', value: stats.totalJobsCount, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'bg-orange-500', lightBg: 'bg-orange-50', href: '/jobs' },
    { label: 'Users', value: stats.users, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'bg-pink-500', lightBg: 'bg-pink-50', href: '/users' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your JobFinder platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="block">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-lg p-3 ${stat.lightBg}`}>
                  <svg className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
              <Link href="/jobs" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentJobs.map((job) => (
                <div key={job.id} className="px-6 py-4 flex items-center hover:bg-gray-50 transition-colors">
                  <div className="text-2xl mr-4">{job.logo}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.company}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-500">{job.location}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{job.posted}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/jobs" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-blue-700">Add New Job</span>
              </Link>
              <Link href="/companies" className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-green-700">Add Company</span>
              </Link>
              <Link href="/categories" className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-purple-700">Add Category</span>
              </Link>
              <Link href="/users" className="flex items-center p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                <svg className="w-5 h-5 text-pink-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-pink-700">Manage Users</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">Full-time</span>
                  <span className="font-medium text-gray-900">
                    {recentJobs.filter((j) => j.type === 'Full-time').length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${recentJobs.length ? (recentJobs.filter((j) => j.type === 'Full-time').length / recentJobs.length) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">Remote</span>
                  <span className="font-medium text-gray-900">
                    {recentJobs.filter((j) => j.location === 'Remote').length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${recentJobs.length ? (recentJobs.filter((j) => j.location === 'Remote').length / recentJobs.length) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
