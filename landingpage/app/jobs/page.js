import Link from 'next/link'

// Mock data for all jobs
const allJobs = [
  { id: 1, title: 'Senior Frontend Developer', company: 'TechCorp', location: 'Bangkok, Thailand', type: 'Full-time', salary: '฿80,000 - ฿120,000', tags: ['React', 'TypeScript', 'Next.js'], posted: '2 days ago', logo: '🏢', urgent: true },
  { id: 2, title: 'Backend Engineer', company: 'StartupXYZ', location: 'Remote', type: 'Full-time', salary: '฿70,000 - ฿110,000', tags: ['Node.js', 'Python', 'AWS'], posted: '1 day ago', logo: '🚀', urgent: false },
  { id: 3, title: 'UI/UX Designer', company: 'DesignStudio', location: 'Bangkok, Thailand', type: 'Contract', salary: '฿60,000 - ฿90,000', tags: ['Figma', 'Adobe XD', 'Prototyping'], posted: '3 hours ago', logo: '🎨', urgent: false },
  { id: 4, title: 'DevOps Engineer', company: 'CloudFirst', location: 'Remote', type: 'Full-time', salary: '฿90,000 - ฿140,000', tags: ['Docker', 'Kubernetes', 'CI/CD'], posted: '5 hours ago', logo: '☁️', urgent: true },
  { id: 5, title: 'Data Scientist', company: 'DataDriven', location: 'Chiang Mai, Thailand', type: 'Full-time', salary: '฿85,000 - ฿130,000', tags: ['Python', 'ML', 'TensorFlow'], posted: '1 week ago', logo: '📊', urgent: false },
  { id: 6, title: 'Mobile App Developer', company: 'AppWorks', location: 'Bangkok, Thailand', type: 'Part-time', salary: '฿50,000 - ฿80,000', tags: ['React Native', 'iOS', 'Android'], posted: '4 days ago', logo: '📱', urgent: false },
  { id: 7, title: 'Full Stack Developer', company: 'WebSolutions', location: 'Remote', type: 'Full-time', salary: '฿75,000 - ฿115,000', tags: ['Vue.js', 'Django', 'PostgreSQL'], posted: '6 hours ago', logo: '🌐', urgent: true },
  { id: 8, title: 'QA Engineer', company: 'QualityFirst', location: 'Bangkok, Thailand', type: 'Full-time', salary: '฿55,000 - ฿85,000', tags: ['Selenium', 'Cypress', 'Automation'], posted: '2 days ago', logo: '🔍', urgent: false },
  { id: 9, title: 'Product Manager', company: 'InnovateCo', location: 'Bangkok, Thailand', type: 'Full-time', salary: '฿100,000 - ฿150,000', tags: ['Agile', 'Scrum', 'Strategy'], posted: '3 days ago', logo: '📋', urgent: false },
  { id: 10, title: 'Security Engineer', company: 'SecureTech', location: 'Remote', type: 'Full-time', salary: '฿95,000 - ฿145,000', tags: ['Pen Testing', 'SIEM', 'Compliance'], posted: '1 day ago', logo: '🔒', urgent: true },
  { id: 11, title: 'Cloud Architect', company: 'SkyNet', location: 'Bangkok, Thailand', type: 'Full-time', salary: '฿120,000 - ฿180,000', tags: ['AWS', 'Azure', 'GCP'], posted: '5 days ago', logo: '🏗️', urgent: false },
  { id: 12, title: 'Machine Learning Engineer', company: 'AICorp', location: 'Remote', type: 'Full-time', salary: '฿100,000 - ฿160,000', tags: ['PyTorch', 'NLP', 'Computer Vision'], posted: '12 hours ago', logo: '🤖', urgent: true },
]

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote'];
const locations = ['All', 'Bangkok, Thailand', 'Remote', 'Chiang Mai, Thailand'];

export default function JobsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
              <p className="text-gray-500 mt-1">Showing {allJobs.length} job openings</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Most Recent</option>
                <option>Most Relevant</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Types</option>
                {jobTypes.map(type => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search Filter */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Search</h3>
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location Filter */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
                <div className="space-y-2">
                  {locations.map(loc => (
                    <label key={loc} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-600">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Type Filter */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Job Type</h3>
                <div className="space-y-2">
                  {jobTypes.map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range Filter */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Salary Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="salary" className="text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">฿0 - ฿50,000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="salary" className="text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">฿50,000 - ฿100,000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="salary" className="text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">฿100,000 - ฿150,000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="salary" className="text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">฿150,000+</span>
                  </label>
                </div>
              </div>

              {/* Urgent Only */}
              <div className="card">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-900">Urgent Hiring Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Job Listings */}
          <div className="flex-1">
            <div className="space-y-4">
              {allJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className={`card cursor-pointer group block ${job.urgent ? 'border-l-4 border-l-red-500' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">{job.logo}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-gray-500">{job.company}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {job.urgent && (
                            <span className="badge bg-red-100 text-red-700">🔥 Urgent</span>
                          )}
                          <button className="text-gray-400 hover:text-red-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {job.salary}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {job.tags.map((tag) => (
                          <span key={tag} className="badge bg-gray-100 text-gray-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Posted {job.posted}</span>
                    <span className="text-blue-600 font-medium text-sm group-hover:underline">View Details →</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                Previous
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">2</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">3</button>
              <span className="text-gray-400">...</span>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">10</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
