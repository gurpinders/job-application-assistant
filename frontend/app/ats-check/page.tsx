'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"

interface Resume {
  id: number
  filename: string
}

interface ATSResult {
  ats_score: number
  issues_found: string[]
  recommendations: string[]
  is_ats_friendly: boolean
}

export default function ATSCheckPage(){
    const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
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

    const handleCheck = async () => {
        if (!selectedResumeId) {
            setError("Please select a resume")
            return
        }
        
        setLoading(true)
        setError(null)
        
        try {
            const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/ats-check/check?user_id=${session?.user?.id}`,
            {
                resume_id: selectedResumeId
            }
            )
            
            setAtsResult(response.data)
        } catch {
            setError("Failed to check ATS compatibility. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
    <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">ATS Compatibility Checker</h1>
            <p className="text-gray-600 mb-6">
            Check if your resume is compatible with Applicant Tracking Systems (ATS)
            </p>
            
            {/* Resume Selector */}
            <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
                Select Resume to Check
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
            onClick={handleCheck}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-300 transition"
            >
            {loading ? 'Checking...' : 'Check ATS Compatibility'}
            </button>
        </div>

        {/* Error Display */}
        {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 text-center">{error}</p>
            </div>
        )}

        {/* Results will go here */}
        {/* ATS Check Results */}
        {atsResult && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-8">
            {/* Score and Status */}
            <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">ATS Compatibility Score</h2>
            <div className="flex items-center justify-center gap-6">
                <div className={`text-6xl font-bold ${
                atsResult.ats_score >= 70 ? 'text-green-600' :
                atsResult.ats_score >= 50 ? 'text-yellow-600' :
                'text-red-600'
                }`}>
                {atsResult.ats_score}
                </div>
                <div>
                {atsResult.is_ats_friendly ? (
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-lg">
                    ✓ ATS Friendly
                    </span>
                ) : (
                    <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold text-lg">
                    ✗ Needs Improvement
                    </span>
                )}
                </div>
            </div>
            </div>

            {/* Issues Found */}
            {atsResult.issues_found.length > 0 && (
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-red-700">⚠️ Issues Found</h3>
                <ul className="space-y-2">
                {atsResult.issues_found.map((issue, index) => (
                    <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-gray-700">{issue}</span>
                    </li>
                ))}
                </ul>
            </div>
            )}

            {/* Recommendations */}
            <div>
            <h3 className="text-xl font-semibold mb-3 text-green-700">💡 Recommendations</h3>
            <ul className="space-y-2">
                {atsResult.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{recommendation}</span>
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