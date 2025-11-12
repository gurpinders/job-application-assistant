'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<'loading' | 'running' | 'error'>('loading')
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (status === 'authenticated') {
      router.push('/dashboard')
    }

    // Check backend connection
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/`)
      .then(response => response.json())
      .then(() => {
        setBackendStatus('running')
      })
      .catch(() => {
        setBackendStatus('error')
      })
  }, [status, router])

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Loading...</p>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          Job Application Assistant
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          AI-powered tools to help you land your dream job
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-12 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">📝 Resume Analyzer</h3>
            <p className="text-gray-600">Get AI-powered feedback on your resume</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">✉️ Cover Letter Generator</h3>
            <p className="text-gray-600">Create personalized cover letters instantly</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">🎯 Job Match Analyzer</h3>
            <p className="text-gray-600">See how well you match job requirements</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">📊 Application Tracker</h3>
            <p className="text-gray-600">Track your applications with Kanban board</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/register')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => router.push('/login')}
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition"
          >
            Login
          </button>
        </div>

        {backendStatus === 'running' && (
          <p className="text-green-600 mt-8 text-sm">✅ All systems operational</p>
        )}
        {backendStatus === 'error' && (
          <p className="text-red-600 mt-8 text-sm">⚠️ Backend connection issue</p>
        )}
      </div>
    </main>
  )
}