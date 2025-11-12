'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState,useEffect } from 'react'
import StatsCard from '@/components/StatsCard'
import ErrorMessage from '@/components/ErrorMessage'
import axios from 'axios'

interface Analysis {
  id: number
  filename: string
  overall_score: number
  created_at: string
}
interface Analytics {
  total: number
  applied: { count: number; percentage: number }
  interview: { count: number; percentage: number }
  offer: { count: number; percentage: number }
  rejected: { count: number; percentage: number }
}

interface Application {
  id: number
  company_name: string
  job_title: string
  status: string
  application_date: string
  created_at: string
}

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [error, setError] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [applications, setApplications] = useState<Application[]>([])

  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (status !== 'authenticated' || !session?.user?.id){
        return
      }
      try {
        const response = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/user/${session?.user?.id}`);
        const analyticsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/analytics/${session?.user?.id}`)
        const applicationsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/user/${session?.user?.id}`)
        setAnalyses(response.data);
        setAnalytics(analyticsResponse.data)
        setApplications(applicationsResponse.data)
      } catch {
        setError("Failed to load analyses");
      }
    }
    fetchAnalyses()
  }, [session, status])

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <ErrorMessage message={error} />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Welcome Card */}
        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-gray-700 mb-4">Welcome, {session?.user?.name || "User"}! You have uploaded {analyses.length} {analyses.length === 1 ? 'resume' : 'resumes'}.</p>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>

        {analytics && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Applications"
                count={analytics.total}
                percentage={100}
                color="#6B7280"
                icon="📊"
              />
              <StatsCard
                title="Applied"
                count={analytics.applied.count}
                percentage={analytics.applied.percentage}
                color="#6B7280"
                icon="📝"
              />
              <StatsCard
                title="Interview"
                count={analytics.interview.count}
                percentage={analytics.interview.percentage}
                color="#3B82F6"
                icon="💼"
              />
              <StatsCard
                title="Offer"
                count={analytics.offer.count}
                percentage={analytics.offer.percentage}
                color="#10B981"
                icon="🎉"
              />
              <StatsCard
                title="Rejected"
                count={analytics.rejected.count}
                percentage={analytics.rejected.percentage}
                color="#EF4444"
                icon="❌"
              />
            </div>
          </div>
        )}
        {/* Recent Activity Section */}
        {applications.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="divide-y divide-gray-200">
                {applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{app.company_name}</h3>
                        <p className="text-sm text-gray-600">{app.job_title}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          app.status === 'Applied' ? 'bg-gray-100 text-gray-700' :
                          app.status === 'Interview' ? 'bg-blue-100 text-blue-700' :
                          app.status === 'Offer' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {app.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(app.application_date || app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Resume Analyses Section */}
        <div className='mt-8'>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Resume Analyses</h1>
          <div className="space-y-4">
            {analyses.map((analysis) => (
            <div key={analysis.id} onClick={() => router.push(`/resume/${analysis.id}`)} className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{analysis.filename}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{analysis.overall_score}/100</p>
                    <p className="text-sm text-gray-500">Score</p>
                  </div>
                </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}