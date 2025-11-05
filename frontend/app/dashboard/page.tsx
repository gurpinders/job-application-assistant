'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState,useEffect } from 'react'
import axios from 'axios'

interface Analysis {
  id: number
  filename: string
  overall_score: number
  created_at: string
}

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [error, setError] = useState<string | null>(null)

  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (status !== 'authenticated' || !session?.user?.id){
        return
      }
      try {
        const response = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/user/${session?.user?.id}`);
        setAnalyses(response.data);
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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
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