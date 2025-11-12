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

export default function CoverLetterPage(){
    const [jobTitle, setJobTitle] = useState<string>("");
    const [companyName, setCompanyName] = useState<string>("");
    const [jobDescription, setJobDescription] = useState<string>("");
    const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [coverLetter, setCoverLetter] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { data: session } = useSession();
    const router = useRouter();

    const handleGenerate = async () => {
        // Validate fields
        if (!jobTitle || !companyName || !jobDescription || !selectedResumeId) {
            setError("Please fill in all fields")
            return
        }
        
        setLoading(true)
        setError(null)
        
        try {
            // API call
            const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/cover-letter/generate?user_id=${session?.user?.id}`,
            {
                job_title: jobTitle,
                company_name: companyName,
                job_description: jobDescription,
                resume_id: selectedResumeId
            }
            )
            
            setCoverLetter(response.data.cover_letter_text)
        } catch {
            setError("Failed to generate cover letter. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchResumes = async () => {
            if (!session?.user?.id) return;
            try {
                const response = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/user/${session?.user?.id}`);
                setResumes(response.data);
            } catch {
                setError("Failed to load analyses");
            }
        }
        fetchResumes()
    }, [session])

    return(
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Generate Cover Letter</h1>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Job Title</label>
                        <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="e.g. Senior Software Engineer"
                            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Company Name</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. Senior Software Engineer"
                            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Job Description</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here..."
                            rows={6}
                            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Select Resume</label>
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
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-3 px-4 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-300 transition"
                        >
                        {loading ? 'Generating...' : 'Generate Cover Letter'}
                    </button>
                </div>
                {error && <ErrorMessage message={error} />}
                {coverLetter && (
                <div className="mt-6 bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Cover Letter</h2>
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {coverLetter}
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}