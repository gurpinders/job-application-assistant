'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  SparklesIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ArrowUpTrayIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

interface AnalysisResult {
  id: number
  overall_score: number
  analysis_text: string
  suggestions: string[]
  filename: string
}

export default function ResumeAnalyzer() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError('')

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.name.endsWith('.pdf') || droppedFile.name.endsWith('.docx')) {
        setFile(droppedFile)
      } else {
        setError('Please upload a PDF or DOCX file')
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.name.endsWith('.pdf') || selectedFile.name.endsWith('.docx')) {
        setFile(selectedFile)
      } else {
        setError('Please upload a PDF or DOCX file')
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      // Get user ID
      const userResponse = await axios.get(
        `${apiUrl}/api/auth/user`,
        { params: { email: session?.user?.email } }
      )
      const userId = userResponse.data.id

      // Upload resume
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(
        `${apiUrl}/api/resume/upload?user_id=${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setAnalysis(response.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to analyze resume')
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'rgba(16, 185, 129, 0.1)'
    if (score >= 60) return 'rgba(245, 158, 11, 0.1)'
    return 'rgba(239, 68, 68, 0.1)'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Improvement'
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '4px solid #f0f0f0',
            borderTop: '4px solid #0070f3',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }}></div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>
            Analyzing Your Resume
          </h2>
          <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.6 }}>
            Our AI is reviewing your resume and generating personalized feedback...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (analysis) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: '80px' }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #0070f3 0%, #8b5cf6 100%)',
          padding: '60px 0',
          marginBottom: '40px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <CheckCircleIcon style={{ width: '32px', height: '32px', color: 'white' }} />
              <h1 style={{
                fontSize: '42px',
                fontWeight: 800,
                color: 'white',
                margin: 0,
                letterSpacing: '-1px'
              }}>
                Analysis Complete!
              </h1>
            </div>
            <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
              {analysis.filename}
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          {/* Score Card */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '48px',
            marginBottom: '32px',
            border: '1.5px solid #f0f0f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: getScoreBgColor(analysis.overall_score),
                border: `8px solid ${getScoreColor(analysis.overall_score)}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <div style={{
                  fontSize: '56px',
                  fontWeight: 800,
                  color: getScoreColor(analysis.overall_score),
                  lineHeight: 1
                }}>
                  {analysis.overall_score}
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: getScoreColor(analysis.overall_score),
                  marginTop: '4px'
                }}>
                  / 100
                </div>
              </div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#1a1a1a',
                marginBottom: '8px',
                letterSpacing: '-0.5px'
              }}>
                Overall Score: {getScoreLabel(analysis.overall_score)}
              </h2>
              <p style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                Your resume has been analyzed using AI. Review the feedback below to improve your chances.
              </p>
            </div>
          </div>

          {/* Analysis Text */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '32px',
            border: '1.5px solid #f0f0f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0, 112, 243, 0.1) 0%, rgba(0, 112, 243, 0.15) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SparklesIcon style={{ width: '24px', height: '24px', color: '#0070f3' }} />
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#1a1a1a',
                margin: 0,
                letterSpacing: '-0.5px'
              }}>
                AI Analysis
              </h3>
            </div>
            <div style={{
              fontSize: '16px',
              color: '#444',
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap'
            }}>
              {analysis.analysis_text}
            </div>
          </div>

          {/* Suggestions */}
          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '40px',
              marginBottom: '32px',
              border: '1.5px solid #f0f0f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.15) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <LightBulbIcon style={{ width: '24px', height: '24px', color: '#f59e0b' }} />
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#1a1a1a',
                  margin: 0,
                  letterSpacing: '-0.5px'
                }}>
                  Suggestions for Improvement
                </h3>
              </div>
              <div style={{ display: 'grid', gap: '16px' }}>
                {analysis.suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '20px',
                      background: 'rgba(245, 158, 11, 0.05)',
                      borderRadius: '12px',
                      border: '1.5px solid rgba(245, 158, 11, 0.2)',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#f59e0b',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {idx + 1}
                    </div>
                    <p style={{
                      fontSize: '15px',
                      color: '#444',
                      lineHeight: 1.7,
                      margin: 0
                    }}>
                      {suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                setAnalysis(null)
                setFile(null)
              }}
              className="btn-primary"
              style={{ display: 'inline-flex' }}
            >
              Analyze Another Resume
              <ArrowUpTrayIcon style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: '80px' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0070f3 0%, #8b5cf6 100%)',
        padding: '60px 0',
        marginBottom: '40px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <DocumentTextIcon style={{ width: '32px', height: '32px', color: 'white' }} />
            <h1 style={{
              fontSize: '42px',
              fontWeight: 800,
              color: 'white',
              margin: 0,
              letterSpacing: '-1px'
            }}>
              AI Resume Analyzer
            </h1>
          </div>
          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
            Get instant, expert-level feedback powered by AI
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 40px' }}>
        {/* Upload Card */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '48px',
          border: '1.5px solid #f0f0f0',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 800,
            color: '#1a1a1a',
            marginBottom: '8px',
            letterSpacing: '-0.5px',
            textAlign: 'center'
          }}>
            Upload Your Resume
          </h2>
          <p style={{
            color: '#666',
            marginBottom: '32px',
            fontSize: '15px',
            textAlign: 'center'
          }}>
            Upload a PDF or DOCX file to get started
          </p>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1.5px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <ExclamationCircleIcon style={{ width: '20px', height: '20px', color: '#ef4444' }} />
              <p style={{ color: '#ef4444', fontSize: '14px', margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Drag and Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? '#0070f3' : '#e0e0e0'}`,
              borderRadius: '16px',
              padding: '48px',
              textAlign: 'center',
              background: dragActive ? 'rgba(0, 112, 243, 0.05)' : 'transparent',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(0, 112, 243, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <CloudArrowUpIcon style={{ width: '40px', height: '40px', color: '#0070f3' }} />
            </div>

            {file ? (
              <>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 24px',
                  background: 'rgba(0, 112, 243, 0.1)',
                  borderRadius: '12px',
                  marginBottom: '16px'
                }}>
                  <DocumentTextIcon style={{ width: '24px', height: '24px', color: '#0070f3' }} />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#0070f3' }}>
                    {file.name}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Click to change file or drop a new one
                </p>
              </>
            ) : (
              <>
                <p style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  marginBottom: '8px'
                }}>
                  Drop your resume here
                </p>
                <p style={{ fontSize: '15px', color: '#666', marginBottom: '16px' }}>
                  or click to browse
                </p>
                <p style={{ fontSize: '13px', color: '#999' }}>
                  Supports PDF and DOCX files
                </p>
              </>
            )}

            <input
              id="fileInput"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          {file && (
            <button
              onClick={handleUpload}
              className="btn-primary"
              style={{
                width: '100%',
                marginTop: '24px',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              Analyze Resume
              <SparklesIcon style={{ width: '18px', height: '18px' }} />
            </button>
          )}
        </div>

        {/* Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {[
            { icon: '⚡', title: 'Instant Analysis', desc: 'Get results in seconds' },
            { icon: '🎯', title: 'AI-Powered', desc: 'Smart suggestions' },
            { icon: '📊', title: 'Detailed Score', desc: 'Know your strengths' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                border: '1.5px solid #f0f0f0',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}