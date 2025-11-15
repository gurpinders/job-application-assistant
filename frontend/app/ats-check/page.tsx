'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import {
  CheckCircleIcon,
  SparklesIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline'

interface Resume {
  id: number
  filename: string
  upload_date: string
}

interface ATSResult {
  id: number
  ats_score: number
  formatting_issues: string[]
  keyword_matches: string[]
  improvement_suggestions: string[]
  filename: string
}

export default function ATSCheck() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null)
  const [error, setError] = useState('')

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

  const handleCheck = async () => {
    if (!selectedResumeId) {
      setError('Please select a resume to check')
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

      const response = await axios.post(`${apiUrl}/api/ats/check`, {
        user_id: userId,
        resume_id: selectedResumeId
      })

      setAtsResult(response.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to check ATS compatibility')
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
    if (score >= 80) return 'ATS Friendly'
    if (score >= 60) return 'Needs Improvement'
    return 'Not ATS Friendly'
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '4px solid #f0f0f0',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }}></div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>
            Checking ATS Compatibility
          </h2>
          <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.6 }}>
            AI is analyzing your resume's compatibility with Applicant Tracking Systems...
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

  if (atsResult) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: '80px' }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          padding: '60px 0',
          marginBottom: '40px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <ShieldCheckIcon style={{ width: '32px', height: '32px', color: 'white' }} />
              <h1 style={{
                fontSize: '42px',
                fontWeight: 800,
                color: 'white',
                margin: 0,
                letterSpacing: '-1px'
              }}>
                ATS Check Complete!
              </h1>
            </div>
            <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
              {atsResult.filename}
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          {/* ATS Score */}
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
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: getScoreBgColor(atsResult.ats_score),
                border: `8px solid ${getScoreColor(atsResult.ats_score)}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <div style={{
                  fontSize: '56px',
                  fontWeight: 800,
                  color: getScoreColor(atsResult.ats_score),
                  lineHeight: 1
                }}>
                  {atsResult.ats_score}
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: getScoreColor(atsResult.ats_score),
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
                {getScoreLabel(atsResult.ats_score)}
              </h2>
              <p style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                {atsResult.ats_score >= 80 
                  ? 'Your resume is well-optimized for ATS systems'
                  : atsResult.ats_score >= 60
                  ? 'Your resume may pass ATS but could be improved'
                  : 'Your resume needs significant improvements for ATS compatibility'}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '24px' }}>
            {/* Keyword Matches */}
            {atsResult.keyword_matches.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px',
                border: '1.5px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.15) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981' }} />
                  </div>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#1a1a1a',
                    margin: 0,
                    letterSpacing: '-0.5px'
                  }}>
                    Strong Keywords Found ({atsResult.keyword_matches.length})
                  </h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {atsResult.keyword_matches.map((keyword, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 18px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '20px',
                        border: '1.5px solid rgba(16, 185, 129, 0.3)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#10b981'
                      }}
                    >
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formatting Issues */}
            {atsResult.formatting_issues.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px',
                border: '1.5px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.15) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <XCircleIcon style={{ width: '24px', height: '24px', color: '#ef4444' }} />
                  </div>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#1a1a1a',
                    margin: 0,
                    letterSpacing: '-0.5px'
                  }}>
                    Formatting Issues ({atsResult.formatting_issues.length})
                  </h3>
                </div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {atsResult.formatting_issues.map((issue, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '16px',
                        background: 'rgba(239, 68, 68, 0.05)',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(239, 68, 68, 0.2)',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start'
                      }}
                    >
                      <XCircleIcon style={{ width: '20px', height: '20px', color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                      <p style={{
                        fontSize: '15px',
                        color: '#444',
                        lineHeight: 1.6,
                        margin: 0
                      }}>
                        {issue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improvement Suggestions */}
            {atsResult.improvement_suggestions.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '40px',
                border: '1.5px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.15) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <SparklesIcon style={{ width: '24px', height: '24px', color: '#6366f1' }} />
                  </div>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#1a1a1a',
                    margin: 0,
                    letterSpacing: '-0.5px'
                  }}>
                    Improvement Suggestions
                  </h3>
                </div>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {atsResult.improvement_suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '20px',
                        background: 'rgba(99, 102, 241, 0.05)',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(99, 102, 241, 0.2)',
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'flex-start'
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#6366f1',
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
          </div>

          {/* Action Button */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              onClick={() => {
                setAtsResult(null)
              }}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
              }}
            >
              Check Another Resume
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
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        padding: '60px 0',
        marginBottom: '40px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <ShieldCheckIcon style={{ width: '32px', height: '32px', color: 'white' }} />
            <h1 style={{
              fontSize: '42px',
              fontWeight: 800,
              color: 'white',
              margin: 0,
              letterSpacing: '-1px'
            }}>
              ATS Compatibility Checker
            </h1>
          </div>
          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
            Ensure your resume passes Applicant Tracking Systems
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 40px' }}>
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
              You need to upload a resume before checking ATS compatibility
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
              Check ATS Compatibility
            </h2>
            <p style={{
              color: '#666',
              marginBottom: '32px',
              fontSize: '15px'
            }}>
              Select a resume to analyze its compatibility with Applicant Tracking Systems
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

            <div style={{ marginBottom: '24px' }}>
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
                    e.target.style.borderColor = '#6366f1'
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
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

            <button
              onClick={handleCheck}
              className="btn-primary"
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
              }}
            >
              <ShieldCheckIcon style={{ width: '18px', height: '18px' }} />
              Check ATS Compatibility
            </button>
          </div>
        )}

        {/* Info Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '32px'
        }}>
          {[
            { icon: '🛡️', title: 'ATS Score', desc: 'Overall compatibility rating' },
            { icon: '🔍', title: 'Keyword Analysis', desc: 'Industry-relevant terms' },
            { icon: '📝', title: 'Format Check', desc: 'Structural compatibility' }
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