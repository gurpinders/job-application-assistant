'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div style={{ margin: 0, padding: 0, background: '#fafafa' }}>
      {/* Container with max-width */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        
        {/* Hero Section */}
        <section style={{ padding: '100px 0 80px', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(0, 112, 243, 0.1) 100%)',
            color: '#8b5cf6',
            padding: '8px 20px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '30px',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            🚀 AI-Powered Job Search Platform
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '68px',
            fontWeight: 800,
            color: '#1a1a1a',
            marginBottom: '24px',
            lineHeight: 1.1,
            letterSpacing: '-2px',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Land Your Dream Job with{' '}
            <span className="gradient-text">AI-Powered Tools</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '22px',
            color: '#666',
            marginBottom: '40px',
            maxWidth: '650px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6
          }}>
            Professional resume analysis, personalized cover letters, and smart application tracking - all in one platform designed to accelerate your job search.
          </p>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '60px'
          }}>
            {session ? (
              <Link href="/dashboard" className="btn-primary">
                Get Started Free
                <span>→</span>
              </Link>
            ) : (
              <>
                <Link href="/register" className="btn-primary">
                  Get Started Free
                  <span>→</span>
                </Link>
                <Link href="/login" className="btn-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Trust Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            alignItems: 'center',
            padding: '30px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            marginBottom: '80px',
            maxWidth: 'fit-content',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '15px' }}>
              <span style={{ fontSize: '20px' }}>✓</span>
              <span>Free Forever</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '15px' }}>
              <span style={{ fontSize: '20px' }}>✓</span>
              <span>No Credit Card</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '15px' }}>
              <span style={{ fontSize: '20px' }}>✓</span>
              <span>Instant Setup</span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section style={{
          background: 'white',
          borderRadius: '24px',
          padding: '60px',
          marginBottom: '100px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px'
          }}>
            {[
              { number: '4+', label: 'AI Models' },
              { number: '95%', label: 'Success Rate' },
              { number: '1K+', label: 'Active Users' },
              { number: '5K+', label: 'Jobs Tracked' }
            ].map((stat, idx) => (
              <div key={idx} style={{
                textAlign: 'center',
                padding: '20px',
                borderRight: idx < 3 ? '1px solid #f0f0f0' : 'none'
              }}>
                <div className="gradient-text" style={{
                  fontSize: '52px',
                  fontWeight: 800,
                  lineHeight: 1,
                  marginBottom: '12px'
                }}>
                  {stat.number}
                </div>
                <div style={{ color: '#666', fontSize: '15px', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section style={{ marginBottom: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '70px' }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: 800,
              color: '#1a1a1a',
              marginBottom: '16px',
              letterSpacing: '-1px'
            }}>
              Everything You Need to Succeed
            </h2>
            <p style={{
              fontSize: '20px',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Powerful AI tools designed to give you a competitive edge in today&apos;s job market
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '30px'
          }}>
            {[
              {
                icon: '📄',
                title: 'AI Resume Analyzer',
                description: 'Get instant, expert-level feedback on your resume. Our AI identifies weaknesses, suggests improvements, and helps you craft the perfect resume.',
                href: session ? '/resume' : '/register',
                bgColor: 'linear-gradient(135deg, rgba(0, 112, 243, 0.1) 0%, rgba(0, 112, 243, 0.15) 100%)'
              },
              {
                icon: '✨',
                title: 'Cover Letter Generator',
                description: 'Create tailored, professional cover letters in seconds. Our AI adapts to any job description and showcases your unique qualifications.',
                href: session ? '/cover-letter/generate' : '/register',
                bgColor: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.15) 100%)'
              },
              {
                icon: '🎯',
                title: 'Job Match Analyzer',
                description: 'See exactly how you match up to any job posting. Get detailed skill comparisons and personalized recommendations to improve your fit.',
                href: session ? '/job-match' : '/register',
                bgColor: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(20, 184, 166, 0.15) 100%)'
              },
              {
                icon: '📊',
                title: 'Application Tracker',
                description: 'Never lose track of an application again. Visual Kanban board helps you manage every step of your job search journey.',
                href: session ? '/applications' : '/register',
                bgColor: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.15) 100%)'
              }
            ].map((feature, idx) => (
              <Link
                key={idx}
                href={feature.href}
                className="card-hover"
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '45px',
                  border: '1.5px solid #f0f0f0',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  marginBottom: '24px',
                  background: feature.bgColor
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#1a1a1a',
                  marginBottom: '12px',
                  letterSpacing: '-0.5px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#666',
                  lineHeight: 1.7,
                  marginBottom: '20px',
                  fontSize: '16px'
                }}>
                  {feature.description}
                </p>
                <div style={{
                  color: '#0070f3',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '15px'
                }}>
                  Learn more <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          borderRadius: '24px',
          padding: '80px 60px',
          marginBottom: '100px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '70px' }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: 800,
              color: '#1a1a1a',
              marginBottom: '16px',
              letterSpacing: '-1px'
            }}>
              How It Works
            </h2>
            <p style={{ fontSize: '20px', color: '#666' }}>
              Get started in three simple steps
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '50px',
            position: 'relative'
          }}>
            {[
              { number: 1, title: 'Upload Your Resume', desc: 'Upload your resume in PDF or DOCX format. Our AI will analyze it instantly.' },
              { number: 2, title: 'Get AI Insights', desc: 'Receive detailed feedback, suggestions, and match scores for job postings.' },
              { number: 3, title: 'Track Applications', desc: 'Manage all your applications in one place and increase your success rate.' }
            ].map((step, idx) => (
              <div key={idx} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div className="gradient-primary" style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: 800,
                  margin: '0 auto 24px',
                  boxShadow: '0 8px 20px rgba(0, 112, 243, 0.3)',
                  color: 'white'
                }}>
                  {step.number}
                </div>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  marginBottom: '12px',
                  color: '#1a1a1a'
                }}>
                  {step.title}
                </h3>
                <p style={{ color: '#666', lineHeight: 1.6, fontSize: '16px' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        {!session && (
          <section className="gradient-primary" style={{
            borderRadius: '24px',
            padding: '80px 60px',
            textAlign: 'center',
            color: 'white',
            marginBottom: '100px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: '48px',
                fontWeight: 800,
                marginBottom: '20px',
                letterSpacing: '-1px'
              }}>
                Ready to Land Your Dream Job?
              </h2>
              <p style={{
                fontSize: '20px',
                marginBottom: '40px',
                opacity: 0.95
              }}>
                Join thousands of job seekers who are getting hired faster with AI
              </p>
              <Link
                href="/register"
                style={{
                  background: 'white',
                  color: '#0070f3',
                  padding: '18px 50px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
                }}
              >
                Start Free Today
                <span>→</span>
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

