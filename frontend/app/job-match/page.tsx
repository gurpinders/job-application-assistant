'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import {
  ChartBarIcon,
  SparklesIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'

interface Resume {
  id: number
  filename: string
  upload_date: string
}

interface MatchResult {
  id: number
  match_percentage: number
  matched_skills: string[]
  missing_skills: string[]
  recommendations: string[]
  job_title: string
}

export default function JobMatch() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
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

  const handleAnalyze = async () => {
    if (!selectedResumeId || !jobDescription.trim() || !jobTitle.trim()) {
      setError('Please select a resume, provide a job title, and paste the job description')
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

      const response = await axios.post(`${apiUrl}/api/job-match/analyze`, {
        user_id: userId,
        resume_id: selectedResumeId,
        job_description: jobDescription,
        job_title: jobTitle
      })

      setMatchResult(response.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to analyze job match')
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return '#10b981'
    if (percentage >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 80) return 'rgba(16, 185, 129, 0.1)'
    if (percentage >= 60) return 'rgba(245, 158, 11, 0.1)'
    return 'rgba(239, 68, 68, 0.1)'
  }

  const getMatchLabel = (percentage: number) => {
    if (percentage >= 80) return 'Excellent Match'
    if (percentage >= 60) return 'Good Match'
    return 'Needs Work'
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '4px solid #f0f0f0',
            borderTop: '4px solid #14b8a6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }}></div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>
            Analyzing Job Match
          </h2>
          <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.6 }}>
            AI is comparing your resume to the job requirements and calculating your match score...
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

  if (matchResult) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: '80px' }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
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
                Match Analysis Complete!
              </h1>
            </div>
            <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
              {matchResult.job_title}
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          {/* Match Score */}
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
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: getMatchBgColor(matchResult.match_percentage),
                border: `10px solid ${getMatchColor(matchResult.match_percentage)}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '64px',
                  fontWeight: 800,
                  color: getMatchColor(matchResult.match_percentage),
                  lineHeight: 1
                }}>
                  {matchResult.match_percentage}%
                </div>
              </div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#1a1a1a',
                marginBottom: '8px',
                letterSpacing: '-0.5px'
              }}>
                {getMatchLabel(matchResult.match_percentage)}
              </h2>
              <p style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                Your resume matches {matchResult.match_percentage}% of the job requirements
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {/* Matched Skills */}
            {matchResult.matched_skills.length > 0 && (
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
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#1a1a1a',
                    margin: 0,
                    letterSpacing: '-0.5px'
                  }}>
                    Matched Skills ({matchResult.matched_skills.length})
                  </h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {matchResult.matched_skills.map((skill, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '20px',
                        border: '1.5px solid rgba(16, 185, 129, 0.3)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#10b981'
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {matchResult.missing_skills.length > 0 && (
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
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#1a1a1a',
                    margin: 0,
                    letterSpacing: '-0.5px'
                  }}>
                    Missing Skills ({matchResult.missing_skills.length})
                  </h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {matchResult.missing_skills.map((skill, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '20px',
                        border: '1.5px solid rgba(239, 68, 68, 0.3)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#ef4444'
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {matchResult.recommendations.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '40px',
              marginTop: '24px',
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
                  Recommendations
                </h3>
              </div>
              <div style={{ display: 'grid', gap: '16px' }}>
                {matchResult.recommendations.map((rec, idx) => (
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
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              onClick={() => {
                setMatchResult(null)
                setJobDescription('')
                setJobTitle('')
              }}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
              }}
            >
              Analyze Another Job
              <SparklesIcon style={{ width: '18px', height: '18px' }} />
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
        background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
        padding: '60px 0',
        marginBottom: '40px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <ChartBarIcon style={{ width: '32px', height: '32px', color: 'white' }} />
            <h1 style={{
              fontSize: '42px',
              fontWeight: 800,
              color: 'white',
              margin: 0,
              letterSpacing: '-1px'
            }}>
              Job Match Analyzer
            </h1>
          </div>
          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
            See exactly how you match up to any job posting
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
              You need to upload a resume before analyzing job matches
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
              Analyze Job Match
            </h2>
            <p style={{
              color: '#666',
              marginBottom: '32px',
              fontSize: '15px'
            }}>
              Select a resume and paste the job description to get your match score
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
                      e.target.style.borderColor = '#14b8a6'
                      e.target.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)'
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

              {/* Job Title */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  marginBottom: '8px'
                }}>
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                    border: '1.5px solid #e0e0e0',
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#14b8a6'
                    e.target.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
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
                    placeholder="Paste the full job description here..."
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
                      e.target.style.borderColor = '#14b8a6'
                      e.target.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                className="btn-primary"
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
                }}
              >
                <SparklesIcon style={{ width: '18px', height: '18px' }} />
                Analyze Match
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
            { icon: '🎯', title: 'Match Score', desc: 'Percentage-based rating' },
            { icon: '✅', title: 'Skill Analysis', desc: 'Matched vs missing skills' },
            { icon: '💡', title: 'Recommendations', desc: 'How to improve your fit' }
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