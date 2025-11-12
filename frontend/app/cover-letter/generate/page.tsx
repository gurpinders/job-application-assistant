'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import ErrorMessage from '@/components/ErrorMessage'

interface Resume {
  id: number
  filename: string
}

export default function CoverLetterPage() {
  const { data: session } = useSession()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setCoverLetter('')

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cover-letter/generate?user_id=${session?.user?.id}`,
        {
          resume_id: selectedResumeId,
          job_title: jobTitle,
          company_name: companyName,
          job_description: jobDescription,
        }
      )
      setCoverLetter(response.data.cover_letter_text)
    } catch (err) {
      setError('Failed to generate cover letter. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cover Letter Generator</h1>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <form onSubmit={handleGenerate} className="space-y-6">
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
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-900 mb-2">
                Job Title
              </label>
              <input
                id="jobTitle"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-900 mb-2">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Google"
              />
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
                rows={8}
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
              {loading ? 'Generating...' : 'Generate Cover Letter'}
            </button>
          </form>
        </div>

        {coverLetter && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cover Letter</h2>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-900">{coverLetter}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}