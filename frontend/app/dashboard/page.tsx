'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  ArrowRightIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface ResumeAnalysis {
  id: number
  filename: string
  upload_date: string
  overall_score: number
  analysis_text: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recentAnalyses, setRecentAnalyses] = useState<ResumeAnalysis[]>([])
  const [stats, setStats] = useState({
    totalResumes: 0,
    totalCoverLetters: 0,
    totalMatches: 0,
    totalApplications: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.email) {
      fetchDashboardData()
    }
  }, [status, session, router])

  const fetchDashboardData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      // Get user email from session
      const userEmail = session?.user?.email
      
      if (!userEmail) {
        console.error('No user email found')
        setLoading(false)
        return
      }

      console.log('🔍 Fetching data for user:', userEmail)
      console.log('🌐 API URL:', apiUrl)

      // Try to fetch user ID from backend
      try {
        console.log('📡 Attempting to fetch user ID...')
        const userResponse = await axios.get(
          `${apiUrl}/api/auth/user`,
          {
            params: { email: userEmail }
          }
        )
        
        console.log('✅ User response:', userResponse.data)
        const userId = userResponse.data.id

        // Fetch recent resume analyses - USE CORRECT ENDPOINT
        console.log('📡 Fetching resumes for user ID:', userId)
        const resumesResponse = await axios.get(
          `${apiUrl}/api/resume/user/${userId}`
        )
        
        console.log('✅ Resumes fetched:', resumesResponse.data)
        setRecentAnalyses(resumesResponse.data.slice(0, 3))

        // Fetch stats
        setStats({
          totalResumes: resumesResponse.data.length,
          totalCoverLetters: 0,
          totalMatches: 0,
          totalApplications: 0
        })
      } catch (apiError) {
        if (axios.isAxiosError(apiError)) {
          console.error('❌ API Error Details:')
          console.error('Status:', apiError.response?.status)
          console.error('Status Text:', apiError.response?.statusText)
          console.error('Data:', apiError.response?.data)
        } else {
          console.error('❌ Unknown error:', apiError)
        }
        
        // Set empty state
        setRecentAnalyses([])
        setStats({
          totalResumes: 0,
          totalCoverLetters: 0,
          totalMatches: 0,
          totalApplications: 0
        })
      }
    } catch (error) {
      console.error('❌ Outer error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#fafafa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #f0f0f0',
            borderTop: '3px solid #0070f3',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '16px', color: '#666' }}>Loading...</p>
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
            <SparklesIcon style={{ width: '32px', height: '32px', color: 'white' }} />
            <h1 style={{
              fontSize: '42px',
              fontWeight: 800,
              color: 'white',
              margin: 0,
              letterSpacing: '-1px'
            }}>
              Welcome back, {session?.user?.name || 'there'}!
            </h1>
          </div>
          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
            Your AI-powered job search dashboard
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {[
            {
              icon: DocumentTextIcon,
              label: 'Resumes Analyzed',
              value: stats.totalResumes,
              color: '#0070f3',
              bgColor: 'rgba(0, 112, 243, 0.1)'
            },
            {
              icon: DocumentDuplicateIcon,
              label: 'Cover Letters',
              value: stats.totalCoverLetters,
              color: '#8b5cf6',
              bgColor: 'rgba(139, 92, 246, 0.1)'
            },
            {
              icon: ChartBarIcon,
              label: 'Job Matches',
              value: stats.totalMatches,
              color: '#14b8a6',
              bgColor: 'rgba(20, 184, 166, 0.1)'
            },
            {
              icon: BriefcaseIcon,
              label: 'Applications',
              value: stats.totalApplications,
              color: '#f59e0b',
              bgColor: 'rgba(245, 158, 11, 0.1)'
            }
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                padding: '32px',
                borderRadius: '20px',
                border: '1.5px solid #f0f0f0',
                transition: 'all 0.3s'
              }}
              className="card-hover"
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: stat.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <stat.icon style={{ width: '28px', height: '28px', color: stat.color }} />
              </div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#1a1a1a', marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '15px', color: '#666', fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#1a1a1a',
            marginBottom: '24px',
            letterSpacing: '-0.5px'
          }}>
            Quick Actions
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {[
              {
                href: '/resume-analyzer',
                icon: DocumentTextIcon,
                title: 'Analyze Resume',
                description: 'Get AI feedback on your resume',
                gradient: 'linear-gradient(135deg, #0070f3 0%, #0060d9 100%)'
              },
              {
                href: '/cover-letter/generate',
                icon: DocumentDuplicateIcon,
                title: 'Generate Cover Letter',
                description: 'Create a personalized cover letter',
                gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
              },
              {
                href: '/job-match',
                icon: ChartBarIcon,
                title: 'Match Job',
                description: 'See how you match a job posting',
                gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
              },
              {
                href: '/applications',
                icon: BriefcaseIcon,
                title: 'Track Applications',
                description: 'Manage your job applications',
                gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              }
            ].map((action, idx) => (
              <Link
                key={idx}
                href={action.href}
                style={{
                  background: action.gradient,
                  padding: '28px',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  color: 'white',
                  transition: 'all 0.3s',
                  display: 'block',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              >
                <action.icon style={{ width: '32px', height: '32px', marginBottom: '12px' }} />
                <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
                  {action.title}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>
                  {action.description}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#1a1a1a',
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              Recent Resume Analyses
            </h2>
            <Link
              href="/resume-analyzer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#0070f3',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 600,
                transition: 'gap 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.gap = '10px'}
              onMouseLeave={(e) => e.currentTarget.style.gap = '6px'}
            >
              View all <ArrowRightIcon style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>

          {recentAnalyses.length === 0 ? (
            <div style={{
              background: 'white',
              padding: '60px 40px',
              borderRadius: '20px',
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
                No resumes analyzed yet
              </h3>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                Upload your first resume to get AI-powered feedback
              </p>
              <Link
                href="/resume-analyzer"
                className="btn-primary"
                style={{ display: 'inline-flex' }}
              >
                Analyze Resume
                <ArrowRightIcon style={{ width: '18px', height: '18px' }} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {recentAnalyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  href={`/resume-analyzer?id=${analysis.id}`}
                  style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1.5px solid #f0f0f0',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s'
                  }}
                  className="card-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(0, 112, 243, 0.1) 0%, rgba(0, 112, 243, 0.15) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <DocumentTextIcon style={{ width: '24px', height: '24px', color: '#0070f3' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px' }}>
                        {analysis.filename}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#666' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ClockIcon style={{ width: '16px', height: '16px' }} />
                          {new Date(analysis.upload_date).toLocaleDateString()}
                        </div>
                        <div style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          background: analysis.overall_score >= 80 ? 'rgba(16, 185, 129, 0.1)' : 
                                     analysis.overall_score >= 60 ? 'rgba(245, 158, 11, 0.1)' : 
                                     'rgba(239, 68, 68, 0.1)',
                          color: analysis.overall_score >= 80 ? '#10b981' : 
                                analysis.overall_score >= 60 ? '#f59e0b' : 
                                '#ef4444',
                          fontSize: '13px',
                          fontWeight: 600
                        }}>
                          Score: {analysis.overall_score}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <ArrowRightIcon style={{ width: '20px', height: '20px', color: '#d0d0d0' }} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}