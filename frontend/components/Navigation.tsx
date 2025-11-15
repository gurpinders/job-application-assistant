'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  DocumentTextIcon, 
  DocumentDuplicateIcon,
  ChartBarIcon,
  CheckCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function Navigation() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  if (status === 'loading') {
    return (
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e8e8e8',
        padding: '20px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <nav style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px'
        }}>
          <div className="gradient-text" style={{
            fontSize: '26px',
            fontWeight: 700,
            letterSpacing: '-0.5px'
          }}>
            JobAssist
          </div>
          <div style={{ width: '200px', height: '40px', background: '#f0f0f0', borderRadius: '8px' }}></div>
        </nav>
      </header>
    )
  }

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e8e8e8',
      padding: '20px 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'all 0.3s'
    }}>
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px'
      }}>
        {/* Logo */}
        <Link 
          href="/" 
          className="gradient-text"
          style={{
            fontSize: '26px',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            textDecoration: 'none',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          JobAssist
        </Link>

        {/* Desktop Navigation */}
        {session ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }} className="hidden md:flex">
              <Link
                href="/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  color: isActive('/dashboard') ? '#0070f3' : '#666',
                  fontWeight: 500,
                  fontSize: '15px',
                  transition: 'color 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0070f3'}
                onMouseLeave={(e) => e.currentTarget.style.color = isActive('/dashboard') ? '#0070f3' : '#666'}
              >
                <HomeIcon style={{ width: '20px', height: '20px' }} />
                Dashboard
              </Link>
              <Link
                href="/resume-analyzer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  color: isActive('/resume-analyzer') ? '#0070f3' : '#666',
                  fontWeight: 500,
                  fontSize: '15px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0070f3'}
                onMouseLeave={(e) => e.currentTarget.style.color = isActive('/resume-analyzer') ? '#0070f3' : '#666'}
              >
                <DocumentTextIcon style={{ width: '20px', height: '20px' }} />
                Resume
              </Link>
              <Link
                href="/cover-letter/generate"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  color: pathname.startsWith('/cover-letter') ? '#0070f3' : '#666',
                  fontWeight: 500,
                  fontSize: '15px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0070f3'}
                onMouseLeave={(e) => e.currentTarget.style.color = pathname.startsWith('/cover-letter') ? '#0070f3' : '#666'}
              >
                <DocumentDuplicateIcon style={{ width: '20px', height: '20px' }} />
                Cover Letter
              </Link>
              <Link
                href="/job-match"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  color: isActive('/job-match') ? '#0070f3' : '#666',
                  fontWeight: 500,
                  fontSize: '15px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0070f3'}
                onMouseLeave={(e) => e.currentTarget.style.color = isActive('/job-match') ? '#0070f3' : '#666'}
              >
                <ChartBarIcon style={{ width: '20px', height: '20px' }} />
                Job Match
              </Link>
              <Link
                href="/ats-check"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  color: isActive('/ats-check') ? '#0070f3' : '#666',
                  fontWeight: 500,
                  fontSize: '15px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0070f3'}
                onMouseLeave={(e) => e.currentTarget.style.color = isActive('/ats-check') ? '#0070f3' : '#666'}
              >
                <CheckCircleIcon style={{ width: '20px', height: '20px' }} />
                ATS Check
              </Link>
              <Link
                href="/applications"
                style={{
                  textDecoration: 'none',
                  color: isActive('/applications') ? '#0070f3' : '#666',
                  fontWeight: 500,
                  fontSize: '15px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0070f3'}
                onMouseLeave={(e) => e.currentTarget.style.color = isActive('/applications') ? '#0070f3' : '#666'}
              >
                Applications
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="hidden md:flex">
              <span style={{ fontSize: '14px', color: '#666' }}>
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{
                  padding: '10px 24px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#666',
                  border: '1.5px solid #e0e0e0',
                  borderRadius: '8px',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0070f3'
                  e.currentTarget.style.color = '#0070f3'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0'
                  e.currentTarget.style.color = '#666'
                }}
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }} className="hidden md:flex">
              <Link
                href="/"
                style={{
                  textDecoration: 'none',
                  color: '#666',
                  fontWeight: 500,
                  fontSize: '15px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0070f3'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
              >
                Features
              </Link>
              <Link
                href="/"
                style={{
                  textDecoration: 'none',
                  color: '#666',
                  fontWeight: 500,
                  fontSize: '15px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0070f3'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
              >
                How It Works
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="hidden md:flex">
              <Link
                href="/login"
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: '#0070f3',
                  border: '1.5px solid #e0e0e0',
                  transition: 'all 0.3s',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0070f3'
                  e.currentTarget.style.background = 'rgba(0, 112, 243, 0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="gradient-primary"
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  transition: 'all 0.3s',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}
              >
                Sign Up
              </Link>
            </div>
          </>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            padding: '8px',
            color: '#666',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
          className="md:hidden block"
        >
          {mobileMenuOpen ? (
            <XMarkIcon style={{ width: '24px', height: '24px' }} />
          ) : (
            <Bars3Icon style={{ width: '24px', height: '24px' }} />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          marginTop: '16px',
          paddingBottom: '16px',
          borderTop: '1px solid #e8e8e8',
          paddingTop: '16px',
          paddingLeft: '40px',
          paddingRight: '40px'
        }} className="md:hidden">
          {session ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                href="/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#666',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <HomeIcon style={{ width: '20px', height: '20px' }} />
                Dashboard
              </Link>
              <Link
                href="/resume-analyzer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#666',
                  textDecoration: 'none',
                  borderRadius: '8px'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <DocumentTextIcon style={{ width: '20px', height: '20px' }} />
                Resume Analyzer
              </Link>
              <Link
                href="/cover-letter/generate"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#666',
                  textDecoration: 'none',
                  borderRadius: '8px'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <DocumentDuplicateIcon style={{ width: '20px', height: '20px' }} />
                Cover Letter
              </Link>
              <Link
                href="/job-match"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#666',
                  textDecoration: 'none',
                  borderRadius: '8px'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ChartBarIcon style={{ width: '20px', height: '20px' }} />
                Job Match
              </Link>
              <Link
                href="/ats-check"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#666',
                  textDecoration: 'none',
                  borderRadius: '8px'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <CheckCircleIcon style={{ width: '20px', height: '20px' }} />
                ATS Check
              </Link>
              <Link
                href="/applications"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#666',
                  textDecoration: 'none',
                  borderRadius: '8px'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Applications
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  signOut({ callbackUrl: '/' })
                }}
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                  borderRadius: '8px',
                  background: '#ef4444',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                href="/login"
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center',
                  color: '#0070f3',
                  border: '1.5px solid #e0e0e0',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="gradient-primary"
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}