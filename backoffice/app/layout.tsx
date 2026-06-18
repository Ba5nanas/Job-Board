import './globals.css'
import { Sidebar } from './components/Sidebar'
import { AuthProvider } from './contexts/AuthContext'

export const metadata = {
  title: 'JobFinder Admin',
  description: 'Admin panel for JobFinder',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Sidebar />
          <div className="md:pl-64">
            <main className="min-h-screen bg-gray-50 pt-14 md:pt-0">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
