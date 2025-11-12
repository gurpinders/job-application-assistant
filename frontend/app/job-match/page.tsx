'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ErrorMessage from '@/components/ErrorMessage'
import axios from "axios"

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

export default function JobMatchPage(){
    const [jobDescription, setJobDescription] = useState<string>("")
    const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        const fetchResumes = async () => {
            if (!session?.user?.id) return;

            try {
                const response = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/user/${session?.user?.id}`);
                setResumes(response.data);
            } catch {
                setError("Failed to load resumes");
            }
        }
        
        fetchResumes()
    }, [session])

    const handleAnalyze = async () => {
        if (!jobDescription || !selectedResumeId) {
            setError("Please fill in all fields")
            return
        }
        
        setLoading(true)
        setError(null)
        
        try {
            const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/job-match/analyze?user_id=${session?.user?.id}`,
            {
                job_description: jobDescription,
                resume_id: selectedResumeId
            }
            )
            
            setMatchResult(response.data)
        } catch {
            setError("Failed to analyze job match. Please try again.")
        } finally {
            setLoading(false)
        }
    }
    return (
    <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Job Match Analyzer</h1>
            
            {/* Job Description */}
            <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
                Job Description
            </label>
            <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={8}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>

            {/* Resume Selector */}
            <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
                Select Resume
            </label>
            <select
                value={selectedResumeId || ""}
                onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Choose a resume...</option>
                {resumes.map(resume => (
                <option key={resume.id} value={resume.id}>
                    {resume.filename}
                </option>
                ))}
            </select>
            </div>

            {/* Submit Button */}
            <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-300 transition"
            >
            {loading ? 'Analyzing...' : 'Analyze Match'}
            </button>
        </div>

        {/* Error Display */}
        {error && <div className="mt-4"><ErrorMessage message={error} /></div>}

        {matchResult && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-8">
            {/* Match Percentage */}
            <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Match Score</h2>
            <div className="inline-block">
                <div className={`text-6xl font-bold ${
                matchResult.match_percentage >= 70 ? 'text-green-600' :
                matchResult.match_percentage >= 50 ? 'text-yellow-600' :
                'text-red-600'
                }`}>
                {matchResult.match_percentage}%
                </div>
            </div>
            </div>

            {/* Matching Skills */}
            <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-green-700">✓ Matching Skills</h3>
            <div className="flex flex-wrap gap-2">
                {matchResult.matching_skills.map((skill, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                </span>
                ))}
            </div>
            </div>

            {/* Missing Skills */}
            <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-orange-700">⚠ Missing Skills</h3>
            <div className="flex flex-wrap gap-2">
                {matchResult.missing_skills.map((skill, index) => (
                <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                </span>
                ))}
            </div>
            </div>

            {/* Suggestions */}
            <div>
            <h3 className="text-xl font-semibold mb-3 text-blue-700">💡 Suggestions</h3>
            <ul className="list-disc list-inside space-y-2">
                {matchResult.suggestions.map((suggestion, index) => (
                <li key={index} className="text-gray-700">
                    {suggestion}
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