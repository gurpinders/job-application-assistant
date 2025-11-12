'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import ErrorMessage from '@/components/ErrorMessage'

interface Resume {
  id: number
  filename: string
}

interface MatchResult {
  match_percentage: number
  matching_skills: string[]
  missing_skills: string[]
  suggestions: string[]
}

export default function JobMatchPage() {
  const { data: session } = useSession()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
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

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setMatchResult(null)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/job-match/analyze?user_id=${session?.user?.id}`,
        {
          resume_id: selectedResumeId,
          job_description: jobDescription,
        }
      )
      setMatchResult(response.data)
    } catch (err) {
      setError('Failed to analyze job match. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getMatchColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600'
    if (percentage >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Match Analyzer</h1>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-900 mb-2">
                Select Resume
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

            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-900 mb-2">
                Job Description
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste the job description here..."
              />
            </div>

            {error && <ErrorMessage message={error} />}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Analyzing...' : 'Analyze Match'}
            </button>
          </form>
        </div>

        {matchResult && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Match Score</h2>
              <div className={`text-6xl font-bold ${getMatchColor(matchResult.match_percentage)}`}>
                {matchResult.match_percentage}%
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Matching Skills</h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.matching_skills.map((skill, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Missing Skills</h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.missing_skills.map((skill, index) => (
                  <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Suggestions</h3>
              <ul className="space-y-2">
                {matchResult.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-900">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}