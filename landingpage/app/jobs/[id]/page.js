import Link from 'next/link'

// Mock data for job detail
const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'Bangkok, Thailand',
    type: 'Full-time',
    salary: '฿80,000 - ฿120,000',
    tags: ['React', 'TypeScript', 'Next.js'],
    posted: '2 days ago',
    logo: '🏢',
    description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building and maintaining user-facing features using modern web technologies.',
    requirements: [
      '5+ years of experience with React and TypeScript',
      'Strong understanding of Next.js and server-side rendering',
      'Experience with RESTful APIs and GraphQL',
      'Familiarity with testing frameworks (Jest, Cypress)',
      'Excellent problem-solving and communication skills',
    ],
    benefits: [
      'Competitive salary and performance bonuses',
      'Health and dental insurance',
      'Flexible working hours and remote options',
      'Professional development budget',
      'Annual team retreats',
    ],
    applications: 47,
    views: 234,
  },
  {
    id: 2,
    title: 'Backend Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    type: 'Full-time',
    salary: '฿70,000 - ฿110,000',
    tags: ['Node.js', 'Python', 'AWS'],
    posted: '1 day ago',
    logo: '🚀',
    description: 'Join our growing engineering team to build scalable backend services. You will work on microservices architecture and cloud infrastructure.',
    requirements: [
      '3+ years of backend development experience',
      'Proficiency in Node.js and Python',
      'Experience with AWS services (EC2, S3, Lambda)',
      'Knowledge of database design (SQL and NoSQL)',
      'Understanding of CI/CD pipelines',
    ],
    benefits: [
      'Fully remote work environment',
      'Unlimited PTO policy',
      'Home office setup allowance',
      'Stock options',
      'Quarterly team meetups',
    ],
    applications: 32,
    views: 189,
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    location: 'Bangkok, Thailand',
    type: 'Contract',
    salary: '฿60,000 - ฿90,000',
    tags: ['Figma', 'Adobe XD', 'Prototyping'],
    posted: '3 hours ago',
    logo: '🎨',
    description: 'We need a creative UI/UX Designer to craft beautiful and intuitive user experiences for our digital products.',
    requirements: [
      '3+ years of UI/UX design experience',
      'Proficiency in Figma and Adobe Creative Suite',
      'Strong portfolio showcasing web and mobile designs',
      'Understanding of user research and usability testing',
      'Experience with design systems',
    ],
    benefits: [
      'Creative and collaborative workspace',
      'Flexible contract terms',
      'Access to premium design tools',
      'Conference attendance budget',
      'Mentorship opportunities',
    ],
    applications: 18,
    views: 95,
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'CloudFirst',
    location: 'Remote',
    type: 'Full-time',
    salary: '฿90,000 - ฿140,000',
    tags: ['Docker', 'Kubernetes', 'CI/CD'],
    posted: '5 hours ago',
    logo: '☁️',
    description: 'Looking for a DevOps Engineer to manage and optimize our cloud infrastructure and deployment pipelines.',
    requirements: [
      '4+ years of DevOps/SRE experience',
      'Expertise in Docker and Kubernetes',
      'Experience with Terraform and Infrastructure as Code',
      'Strong Linux administration skills',
      'Knowledge of monitoring tools (Prometheus, Grafana)',
    ],
    benefits: [
      'Top-tier compensation package',
      'Remote-first culture',
      'Annual learning budget',
      'Health and wellness programs',
      'Sabbatical after 5 years',
    ],
    applications: 61,
    views: 312,
  },
  {
    id: 5,
    title: 'Data Scientist',
    company: 'DataDriven',
    location: 'Chiang Mai, Thailand',
    type: 'Full-time',
    salary: '฿85,000 - ฿130,000',
    tags: ['Python', 'ML', 'TensorFlow'],
    posted: '1 week ago',
    logo: '📊',
    description: 'Join our data science team to build machine learning models that power our recommendation engine and analytics platform.',
    requirements: [
      '3+ years of data science experience',
      'Strong Python skills (Pandas, NumPy, Scikit-learn)',
      'Experience with deep learning frameworks',
      'Statistical analysis and A/B testing expertise',
      'MS or PhD in a quantitative field preferred',
    ],
    benefits: [
      'Competitive salary with research bonus',
      'GPU computing resources',
      'Publication and conference support',
      'Relocation assistance',
      'Collaborative research environment',
    ],
    applications: 29,
    views: 156,
  },
  {
    id: 6,
    title: 'Mobile App Developer',
    company: 'AppWorks',
    location: 'Bangkok, Thailand',
    type: 'Part-time',
    salary: '฿50,000 - ฿80,000',
    tags: ['React Native', 'iOS', 'Android'],
    posted: '4 days ago',
    logo: '📱',
    description: 'We are seeking a Mobile App Developer to build cross-platform mobile applications using React Native.',
    requirements: [
      '2+ years of mobile development experience',
      'Proficiency in React Native',
      'Published apps on iOS and Android stores',
      'Experience with mobile UI/UX best practices',
      'Knowledge of native module development',
    ],
    benefits: [
      'Flexible part-time schedule',
      'Potential to go full-time',
      'Latest devices for testing',
      'App Store revenue sharing',
      'Professional growth opportunities',
    ],
    applications: 38,
    views: 201,
  },
]

export async function generateStaticParams() {
  return jobs.map((job) => ({
    id: String(job.id),
  }))
}

export default function JobDetail({ params }) {
  const job = jobs.find((j) => j.id === Number(params.id))

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
        <p className="text-gray-500 mb-6">The job you are looking for does not exist or has been removed.</p>
        <Link href="/jobs" className="btn-primary">
          Back to Jobs
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/jobs" className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </Link>
          <div className="flex items-start gap-6">
            <div className="text-6xl">{job.logo}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                <span className="font-semibold">{job.company}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {job.location}
                </span>
                <span>•</span>
                <span>{job.posted}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{job.type}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{job.salary}</span>
              </div>
            </div>
            <div className="text-center bg-white/10 rounded-xl px-6 py-4">
              <div className="text-2xl font-bold">{job.views}</div>
              <div className="text-blue-200 text-xs">Views</div>
              <div className="mt-2 text-2xl font-bold">{job.applications}</div>
              <div className="text-blue-200 text-xs">Applications</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-600 leading-relaxed">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
              <ul className="space-y-3">
                {job.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Skills & Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span key={tag} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-4">
              <button className="btn-primary w-full mb-3">Apply Now</button>
              <button className="w-full py-3 px-4 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition-colors">
                Save Job
              </button>
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                <h3 className="font-semibold text-gray-900">Job Details</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Job Type</span>
                  <span className="text-gray-900 font-medium">{job.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Location</span>
                  <span className="text-gray-900 font-medium">{job.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Salary</span>
                  <span className="text-gray-900 font-medium">{job.salary}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Posted</span>
                  <span className="text-gray-900 font-medium">{job.posted}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Experience</span>
                  <span className="text-gray-900 font-medium">3-5 years</span>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">About {job.company}</h3>
              <div className="text-5xl text-center mb-4">{job.logo}</div>
              <p className="text-gray-600 text-sm text-center">
                A leading company in the tech industry, committed to innovation and excellence.
              </p>
              <button className="btn-secondary w-full mt-4 text-sm py-2">
                View Company Profile
              </button>
            </div>

            {/* Share */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Share this job</h3>
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium">
                  Twitter
                </button>
                <button className="flex-1 py-2 px-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium">
                  LinkedIn
                </button>
                <button className="flex-1 py-2 px-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium">
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
