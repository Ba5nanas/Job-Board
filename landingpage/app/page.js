'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:3001'

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, catsRes] = await Promise.all([
          fetch(`${API_BASE}/jobs`),
          fetch(`${API_BASE}/categories`)
        ])
        const jobs = await jobsRes.json()
        const cats = await catsRes.json()
        
        setFeaturedJobs(jobs.slice(0, 6))
        setCategories(cats)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-20 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Find Your Dream
              <span className="block text-blue-200">Career Today</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Browse thousands of job opportunities from top companies around the world. Your next career move starts here.
            </p>

            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
                <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Location"
                    className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
                <button className="btn-primary rounded-xl whitespace-nowrap">
                  Search Jobs
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-12 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-blue-200 text-sm">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">5K+</div>
                <div className="text-blue-200 text-sm">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-blue-200 text-sm">Candidates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
            <p className="text-gray-500 mt-2">Find jobs in your field of expertise</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href="/jobs" className="card text-center cursor-pointer group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
                <p className="text-gray-500 text-xs mt-1">{cat.count} jobs</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
              <p className="text-gray-500 mt-2">Hand-picked opportunities just for you</p>
            </div>
            <Link href="/jobs" className="btn-secondary text-sm py-2 px-4 hidden md:inline-flex">
              View All Jobs →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="card cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{job.logo}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {job.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{job.company}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="badge bg-blue-50 text-blue-700">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                  <span className="badge bg-green-50 text-green-700">{job.type}</span>
                  <span className="badge bg-purple-50 text-purple-700">{job.salary}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span key={tag} className="badge bg-gray-100 text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                  <span>{job.posted}</span>
                  <span className="text-blue-600 font-medium group-hover:underline">Apply Now →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link href="/jobs" className="btn-primary">
              View All Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
