'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface Analysis {
  id: number
  filename: string
  overall_score: number
  analysis_text: string
  suggestions: string[]
}

export default function ResumeResultPage(){
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();
    const id = params.id;
    const router = useRouter();

    useEffect(() => {
        const fetchAnalysis = async() => {
            try {
                const response = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/${id}`);
                setAnalysis(response.data)
            } catch {
                setError("Failed to load analysis. Please try again.")
            } finally {
                setLoading(false)
            }
        }
        fetchAnalysis();
    }, [id])

    return(
        <div className="min-h-screen bg-gray-50 p-4">
            {loading && (
                <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-gray-600">Loading analysis...</p>
                </div>
            )}
            {error && (
                <div className="max-w-4xl mx-auto mt-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <p className="text-red-600 text-center">{error}</p>
                    </div>
                </div>
            )}
            {analysis && (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h1 className="text-3xl font-bold mb-6 text-gray-800">{analysis.filename}</h1>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2 text-gray-700">Overall Score:</h2>
                            <div className="text-5xl font-bold text-blue-600">
                                {analysis.overall_score} / 100
                            </div>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3 text-gray-700">AI Analysis:</h2>
                            <p className="text-gray-600 leading-relaxed">{analysis.analysis_text}</p>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3 text-gray-700">Suggestions:</h2>
                            <ul className="list-disc list-inside space-y-2">
                                {analysis.suggestions.map((suggestion: string, index: number) => (
                                    <li key={index} className="text-gray-600">
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => router.push('/dashboard')} className="flex-1 bg-gray-500 text-white py-3 px-4 rounded font-semibold hover:bg-gray-600 transition">Back To Dashboard</button>
                            <button onClick={() => router.push('/resume/upload')} className="flex-1 bg-blue-500 text-white py-3 px-4 rounded font-semibold hover:bg-blue-600 transition">Upload Another Resume</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

