'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import {
  DocumentDuplicateIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface Resume {
  id: number
  filename: string
  upload_date: string
}

export default function GenerateCoverLetter() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchResumes()
    }
  }, [status, router])

  const fetchResumes = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const userResponse = await axios.get(`${apiUrl}/api/auth/user`, {
        params: { email: session?.user?.email }
      })
      const userId = userResponse.data.id

      const response = await axios.get(`${apiUrl}/api/resume/user/${userId}`)
      setResumes(response.data)
      
      if (response.data.length > 0) {
        setSelectedResumeId(response.data[0].id)
      }
    } catch (error) {
      console.error('Error fetching resumes:', error)
    }
  }

  const handleGenerate = async () => {
    if (!selectedResumeId || !jobDescription.trim()) {
      setError('Please select a resume and provide a job description')
      return
    }

    setLoading(true)
    setError('')

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const userResponse = await axios.get(`${apiUrl}/api/auth/user`, {
        params: { email: session?.user?.email }
      })
      const userId = userResponse.data.id

      const response = await axios.post(`${apiUrl}/api/cover-letter/generate`, {
        user_id: userId,
        resume_id: selectedResumeId,
        job_description: jobDescription
      })

      setCoverLetter(response.data.cover_letter_text)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to generate cover letter')
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cover-letter.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '4px solid #f0f0f0',
            borderTop: '4px solid #8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }}></div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>
            Generating Your Cover Letter
          </h2>
          <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.6 }}>
            AI is crafting a personalized cover letter based on your resume and the job description...
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

  if (coverLetter) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: '80px' }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
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
                Cover Letter Generated!
              </h1>
            </div>
            <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
              Your personalized cover letter is ready
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 40px' }}>
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleCopy}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '14px 24px',
                background: copied ? '#10b981' : 'white',
                color: copied ? 'white' : '#1a1a1a',
                border: copied ? 'none' : '1.5px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              {copied ? (
                <>
                  <CheckCircleIcon style={{ width: '18px', height: '18px' }} />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon style={{ width: '18px', height: '18px' }} />
                  Copy to Clipboard
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '14px 24px',
                background: 'white',
                color: '#1a1a1a',
                border: '1.5px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#8b5cf6'
                e.currentTarget.style.color = '#8b5cf6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0'
                e.currentTarget.style.color = '#1a1a1a'
              }}
            >
              <ArrowDownTrayIcon style={{ width: '18px', height: '18px' }} />
              Download as Text
            </button>
            <button
              onClick={() => {
                setCoverLetter('')
                setJobDescription('')
              }}
              className="btn-primary"
              style={{
                flex: 1,
                minWidth: '200px',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <SparklesIcon style={{ width: '18px', height: '18px' }} />
              Generate Another
            </button>
          </div>

          {/* Cover Letter Display */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '48px',
            border: '1.5px solid #f0f0f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              fontSize: '16px',
              lineHeight: 1.8,
              color: '#1a1a1a',
              whiteSpace: 'pre-wrap',
              fontFamily: 'Georgia, serif'
            }}>
              {coverLetter}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: '80px' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        padding: '60px 0',
        marginBottom: '40px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <DocumentDuplicateIcon style={{ width: '32px', height: '32px', color: 'white' }} />
            <h1 style={{
              fontSize: '42px',
              fontWeight: 800,
              color: 'white',
              margin: 0,
              letterSpacing: '-1px'
            }}>
              Cover Letter Generator
            </h1>
          </div>
          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
            Create tailored, professional cover letters in seconds
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 40px' }}>
        {resumes.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '60px 40px',
            border: '1.5px solid #f0f0f0',
            textAlign: 'center'
          }}>
            <DocumentTextIcon style={{
              width: '64px',
              height: '64px',
              color: '#d0d0d0',
              margin: '0 auto 20px'
            }} />
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>
              No Resumes Found
            </h3>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              You need to upload a resume before generating cover letters
            </p>
            <button
              onClick={() => router.push('/resume')}
              className="btn-primary"
              style={{ display: 'inline-flex' }}
            >
              Upload Resume
              <DocumentTextIcon style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '48px',
            border: '1.5px solid #f0f0f0'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#1a1a1a',
              marginBottom: '8px',
              letterSpacing: '-0.5px'
            }}>
              Generate Your Cover Letter
            </h2>
            <p style={{
              color: '#666',
              marginBottom: '32px',
              fontSize: '15px'
            }}>
              Select a resume and paste the job description
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

            <div style={{ display: 'grid', gap: '24px' }}>
              {/* Resume Selection */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  marginBottom: '8px'
                }}>
                  Select Resume
                </label>
                <div style={{ position: 'relative' }}>
                  <DocumentTextIcon style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    color: '#999'
                  }} />
                  <select
                    value={selectedResumeId || ''}
                    onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '14px 16px 14px 48px',
                      fontSize: '15px',
                      border: '1.5px solid #e0e0e0',
                      borderRadius: '12px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#8b5cf6'
                      e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0'
                      e.target.style.boxShadow = 'none'
                    }}
                  >
                    {resumes.map(resume => (
                      <option key={resume.id} value={resume.id}>
                        {resume.filename} - {new Date(resume.upload_date).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  marginBottom: '8px'
                }}>
                  Job Description
                </label>
                <div style={{ position: 'relative' }}>
                  <BriefcaseIcon style={{
                    position: 'absolute',
                    left: '16px',
                    top: '16px',
                    width: '20px',
                    height: '20px',
                    color: '#999'
                  }} />
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={12}
                    style={{
                      width: '100%',
                      padding: '14px 16px 14px 48px',
                      fontSize: '15px',
                      border: '1.5px solid #e0e0e0',
                      borderRadius: '12px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      lineHeight: 1.6
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#8b5cf6'
                      e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                className="btn-primary"
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                }}
              >
                <SparklesIcon style={{ width: '18px', height: '18px' }} />
                Generate Cover Letter
              </button>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '32px'
        }}>
          {[
            { icon: '🎯', title: 'Tailored Content', desc: 'Matches job requirements' },
            { icon: '⚡', title: 'Instant Results', desc: 'Generated in seconds' },
            { icon: '✨', title: 'Professional', desc: 'ATS-friendly format' }
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