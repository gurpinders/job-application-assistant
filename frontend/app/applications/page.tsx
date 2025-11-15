'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import {
  BriefcaseIcon,
  PlusIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface Application {
  id: number
  company_name: string
  position: string
  location: string
  status: 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected'
  date_applied: string
  notes?: string
  job_url?: string
}

const COLUMNS = [
  { id: 'wishlist', title: 'Wishlist', color: '#6b7280' },
  { id: 'applied', title: 'Applied', color: '#0070f3' },
  { id: 'interview', title: 'Interview', color: '#f59e0b' },
  { id: 'offer', title: 'Offer', color: '#10b981' },
  { id: 'rejected', title: 'Rejected', color: '#ef4444' }
]

export default function Applications() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [draggedApp, setDraggedApp] = useState<Application | null>(null)

  const [formData, setFormData] = useState({
    company_name: '',
    position: '',
    location: '',
    status: 'wishlist' as Application['status'],
    job_url: '',
    notes: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchApplications()
    }
  }, [status, router])

  const fetchApplications = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const userResponse = await axios.get(`${apiUrl}/api/auth/user`, {
        params: { email: session?.user?.email }
      })
      const userId = userResponse.data.id

      const response = await axios.get(`${apiUrl}/api/applications/user/${userId}`)
      setApplications(response.data)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const userResponse = await axios.get(`${apiUrl}/api/auth/user`, {
        params: { email: session?.user?.email }
      })
      const userId = userResponse.data.id

      if (editingApp) {
        await axios.put(`${apiUrl}/api/applications/${editingApp.id}`, {
          ...formData,
          user_id: userId
        })
      } else {
        await axios.post(`${apiUrl}/api/applications`, {
          ...formData,
          user_id: userId
        })
      }

      fetchApplications()
      setShowAddModal(false)
      setEditingApp(null)
      setFormData({
        company_name: '',
        position: '',
        location: '',
        status: 'wishlist',
        job_url: '',
        notes: ''
      })
    } catch (error) {
      console.error('Error saving application:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this application?')) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      await axios.delete(`${apiUrl}/api/applications/${id}`)
      fetchApplications()
    } catch (error) {
      console.error('Error deleting application:', error)
    }
  }

  const handleDragStart = (app: Application) => {
    setDraggedApp(app)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (newStatus: Application['status']) => {
    if (!draggedApp) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      await axios.put(`${apiUrl}/api/applications/${draggedApp.id}`, {
        ...draggedApp,
        status: newStatus
      })
      fetchApplications()
      setDraggedApp(null)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const getApplicationsByStatus = (status: Application['status']) => {
    return applications.filter(app => app.status === status)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #f0f0f0',
          borderTop: '3px solid #0070f3',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: '80px' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        padding: '60px 0',
        marginBottom: '40px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <BriefcaseIcon style={{ width: '32px', height: '32px', color: 'white' }} />
                <h1 style={{
                  fontSize: '42px',
                  fontWeight: 800,
                  color: 'white',
                  margin: 0,
                  letterSpacing: '-1px'
                }}>
                  Application Tracker
                </h1>
              </div>
              <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
                Manage your job applications with a visual Kanban board
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
              style={{
                background: 'white',
                color: '#f59e0b',
                display: 'inline-flex'
              }}
            >
              <PlusIcon style={{ width: '18px', height: '18px' }} />
              Add Application
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {COLUMNS.map(column => (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id as Application['status'])}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                border: '1.5px solid #f0f0f0',
                minHeight: '500px'
              }}
            >
              {/* Column Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: `3px solid ${column.color}`
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#1a1a1a',
                  margin: 0,
                  letterSpacing: '-0.3px'
                }}>
                  {column.title}
                </h3>
                <div style={{
                  background: column.color,
                  color: 'white',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700
                }}>
                  {getApplicationsByStatus(column.id as Application['status']).length}
                </div>
              </div>

              {/* Application Cards */}
              <div style={{ display: 'grid', gap: '12px' }}>
                {getApplicationsByStatus(column.id as Application['status']).map(app => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={() => handleDragStart(app)}
                    style={{
                      background: '#fafafa',
                      border: '1.5px solid #e0e0e0',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'grab',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = column.color
                      e.currentTarget.style.boxShadow = `0 4px 12px ${column.color}20`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#1a1a1a',
                        marginBottom: '4px'
                      }}>
                        {app.position}
                      </h4>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#666',
                        fontSize: '14px',
                        marginBottom: '8px'
                      }}>
                        <BuildingOfficeIcon style={{ width: '16px', height: '16px' }} />
                        {app.company_name}
                      </div>
                      {app.location && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#666',
                          fontSize: '13px',
                          marginBottom: '8px'
                        }}>
                          <MapPinIcon style={{ width: '14px', height: '14px' }} />
                          {app.location}
                        </div>
                      )}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#999',
                        fontSize: '12px'
                      }}>
                        <CalendarIcon style={{ width: '14px', height: '14px' }} />
                        {new Date(app.date_applied).toLocaleDateString()}
                      </div>
                    </div>

                    {app.notes && (
                      <p style={{
                        fontSize: '13px',
                        color: '#666',
                        marginBottom: '12px',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {app.notes}
                      </p>
                    )}

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      paddingTop: '12px',
                      borderTop: '1px solid #e0e0e0'
                    }}>
                      <button
                        onClick={() => {
                          setEditingApp(app)
                          setFormData({
                            company_name: app.company_name,
                            position: app.position,
                            location: app.location,
                            status: app.status,
                            job_url: app.job_url || '',
                            notes: app.notes || ''
                          })
                          setShowAddModal(true)
                        }}
                        style={{
                          flex: 1,
                          padding: '6px',
                          background: 'white',
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#666',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
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
                        <PencilIcon style={{ width: '14px', height: '14px' }} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        style={{
                          flex: 1,
                          padding: '6px',
                          background: 'white',
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#666',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#ef4444'
                          e.currentTarget.style.color = '#ef4444'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e0e0e0'
                          e.currentTarget.style.color = '#666'
                        }}
                      >
                        <TrashIcon style={{ width: '14px', height: '14px' }} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {getApplicationsByStatus(column.id as Application['status']).length === 0 && (
                  <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#999',
                    fontSize: '14px'
                  }}>
                    No applications yet
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => {
          setShowAddModal(false)
          setEditingApp(null)
        }}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#1a1a1a',
                margin: 0
              }}>
                {editingApp ? 'Edit Application' : 'Add Application'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingApp(null)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  color: '#999'
                }}
              >
                <XMarkIcon style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1.5px solid #e0e0e0',
                      borderRadius: '12px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0070f3'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 112, 243, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>
                    Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1.5px solid #e0e0e0',
                      borderRadius: '12px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0070f3'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 112, 243, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1.5px solid #e0e0e0',
                      borderRadius: '12px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0070f3'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 112, 243, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Application['status'] })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1.5px solid #e0e0e0',
                      borderRadius: '12px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0070f3'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 112, 243, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0'
                      e.target.style.boxShadow = 'none'
                    }}
                  >
                    {COLUMNS.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>
                    Job URL
                  </label>
                  <input
                    type="url"
                    value={formData.job_url}
                    onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1.5px solid #e0e0e0',
                      borderRadius: '12px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0070f3'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 112, 243, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1.5px solid #e0e0e0',
                      borderRadius: '12px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0070f3'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 112, 243, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  marginTop: '24px',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                {editingApp ? 'Update Application' : 'Add Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}