import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'JobBoard - Find Your Dream Job',
  description: 'Browse thousands of job opportunities from top companies',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="bg-gray-900 text-gray-400 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1H3zm1 2a1 1 0 011-1h5a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V6zm1 4a1 1 0 011-1h5a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zm8-4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V6zm0 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" />
                    </svg>
                    <span className="text-lg font-bold text-white">JobBoard</span>
                  </div>
                  <p className="text-sm">Connecting talent with opportunity. Find your next career move today.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-3">For Job Seekers</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/jobs" className="hover:text-white transition-colors">Browse Jobs</a></li>
                    <li><a href="/companies" className="hover:text-white transition-colors">Companies</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Salary Guide</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Career Advice</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-3">For Employers</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/register" className="hover:text-white transition-colors">Post a Job</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Recruitment</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-3">Support</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
                <p>&copy; 2025 JobBoard. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
