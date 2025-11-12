'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import ErrorMessage from '@/components/ErrorMessage'

interface Resume {
  id: number
  filename: string
}

interface ATSResult {
  ats_score: number
  is_ats_friendly: boolean
  issues_found: string[]
  recommendations: string[]
}

export default function ATSCheckPage() {
  const { data: session } = useSession()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchResumes = async () => {
      if (!session?.user?.id) return
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/resume/user/${session.user.id}`
        )
        setResumes(response.data)
      } catch (err) {
        setError('Failed to load resumes')
      }
    }
    fetchResumes()
  }, [session])

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setAtsResult(null)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ats-check/check?user_id=${session?.user?.id}`,
        {
          resume_id: selectedResumeId,
        }
      )
      setAtsResult(response.data)
    } catch (err) {
      setError('Failed to check ATS compatibility. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">ATS Compatibility Checker</h1>
        <p className="text-gray-600 mb-8">
          Check if your resume is compatible with Applicant Tracking Systems (ATS) used by employers.
        </p>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <form onSubmit={handleCheck} className="space-y-6">
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-900 mb-2">
                Select Resume to Check
              </label>
              <select
                id="resume"
                value={selectedResumeId || ''}
                onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a resume</option>
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.filename}
                  </option>
                ))}
              </select>
            </div>

            {error && <ErrorMessage message={error} />}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Checking...' : 'Check ATS Compatibility'}
            </button>
          </form>
        </div>

        {atsResult && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">ATS Score</h2>
                <div className={`text-6xl font-bold ${getScoreColor(atsResult.ats_score)}`}>
                  {atsResult.ats_score}/100
                </div>
                <div className="mt-4">
                  {atsResult.is_ats_friendly ? (
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                      ✓ ATS Friendly
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold">
                      ✗ Needs Improvement
                    </span>
                  )}
                </div>
              </div>
            </div>

            {atsResult.issues_found.length > 0 && (
              <div className="bg-white rounded-lg shadow p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Issues Found</h3>
                <ul className="space-y-2">
                  {atsResult.issues_found.map((issue, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span className="text-gray-900">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {atsResult.recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h3>
                <ul className="space-y-2">
                  {atsResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-900">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}