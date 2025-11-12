'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { DndContext,DragEndEvent,DragOverlay,DragStartEvent,PointerSensor,useSensor,useSensors, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import axios from "axios"

interface Application {
  id: number
  user_id: number
  company_name: string
  job_title: string
  job_url?: string
  status: string
  location?: string
  salary_range?: string
  application_date: string
  notes?: string
  created_at: string
  updated_at: string
}

interface ApplicationFormData {
  company_name: string
  job_title: string
  job_url: string
  status: string
  location: string
  salary_range: string
  application_date: string
  notes: string
}

// Application Card Component
function ApplicationCard({ application, onDelete, onEdit }: { application: Application, onDelete: (id: number) => void, onEdit: (application: Application) => void }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: application.id.toString(),
        data: application
    })

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
    } : undefined
    return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-grab active:cursor-grabbing">
      <h3 className="font-semibold text-gray-900 mb-1">{application.company_name}</h3>
      <p className="text-sm text-gray-600 mb-2">{application.job_title}</p>
      
      {application.location && (
        <p className="text-xs text-gray-500 mb-1">📍 {application.location}</p>
      )}
      
      {application.salary_range && (
        <p className="text-xs text-gray-500 mb-2">💰 {application.salary_range}</p>
      )}
      
      <p className="text-xs text-gray-400 mb-3">
        Applied: {new Date(application.application_date).toLocaleDateString()}
      </p>
      
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(application)
          }}
          className="flex-1 bg-blue-500 text-white text-sm py-1 px-3 rounded hover:bg-blue-600 transition"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(application.id)
          }}
          className="flex-1 bg-red-500 text-white text-sm py-1 px-3 rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

// Add Application Modal Component
function AddApplicationModal({ 
  isOpen, 
  onClose, 
  onAdd 
}: { 
  isOpen: boolean
  onClose: () => void
  onAdd: (application: ApplicationFormData) => void
}) {
  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    job_url: '',
    status: 'Applied',
    location: '',
    salary_range: '',
    application_date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add New Application</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold mb-1">Job Title *</label>
            <input
              type="text"
              required
              value={formData.job_title}
              onChange={(e) => setFormData({...formData, job_title: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Job URL */}
          <div>
            <label className="block text-sm font-semibold mb-1">Job URL</label>
            <input
              type="url"
              value={formData.job_url}
              onChange={(e) => setFormData({...formData, job_url: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-1">Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-semibold mb-1">Salary Range</label>
            <input
              type="text"
              placeholder="e.g. $80k - $100k"
              value={formData.salary_range}
              onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Application Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">Application Date *</label>
            <input
              type="date"
              required
              value={formData.application_date}
              onChange={(e) => setFormData({...formData, application_date: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Application Modal Component
function EditApplicationModal({ 
  isOpen, 
  onClose, 
  onUpdate,
  application
}: { 
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: number, data: ApplicationFormData) => void
  application: Application
}) {
  const [formData, setFormData] = useState<ApplicationFormData>({
    company_name: application.company_name,
    job_title: application.job_title,
    job_url: application.job_url || '',
    status: application.status,
    location: application.location || '',
    salary_range: application.salary_range || '',
    application_date: application.application_date.split('T')[0],
    notes: application.notes || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(application.id, formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Application</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Same form fields as AddApplicationModal */}
          <div>
            <label className="block text-sm font-semibold mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Job Title *</label>
            <input
              type="text"
              required
              value={formData.job_title}
              onChange={(e) => setFormData({...formData, job_title: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Job URL</label>
            <input
              type="url"
              value={formData.job_url}
              onChange={(e) => setFormData({...formData, job_url: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Salary Range</label>
            <input
              type="text"
              placeholder="e.g. $80k - $100k"
              value={formData.salary_range}
              onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Application Date *</label>
            <input
              type="date"
              required
              value={formData.application_date}
              onChange={(e) => setFormData({...formData, application_date: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Update Application
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Droppable Column Component
    function DroppableColumn({
    id,
    title,
    count,
    color,
    children
    }: {
    id: string
    title: string
    count: number
    color: string
    children: React.ReactNode
    }) {
        const { setNodeRef, isOver } = useDroppable({ id })

        return (
            <div
            ref={setNodeRef}
            className={`bg-white rounded-lg shadow p-4 transition-colors ${
                isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''
            }`}
            >
            <h2 className={`text-lg font-semibold mb-4 ${color}`}>
                {title} ({count})
            </h2>
            <div className="space-y-3">{children}</div>
            </div>
        )
    }

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [activeId, setActiveId] = useState<number | null>(null)

  const { data: session } = useSession()

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
        distance: 8,
        },
    })
    )

  useEffect(() => {
    const fetchApplications = async () => {
        if (!session?.user?.id) {
        setLoading(false)
        return
        }
        
        try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/applications/user/${session.user.id}`
        )
        setApplications(response.data)
        } catch {
        setError("Failed to load applications")
        } finally {
        setLoading(false)
        }
    }
    fetchApplications()
    }, [session])

    const handleAddApplication = async (formData: ApplicationFormData) => {
        try {
            const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/applications?user_id=${session?.user?.id}`,
            formData
            )
            
            // Add new application to state
            setApplications([response.data, ...applications])
            setShowAddModal(false)
        } catch {
            setError("Failed to create application")
        }
    }

    const handleDeleteApplication = async (id: number) => {
        if (!confirm("Are you sure you want to delete this application?")) {
            return
        }
        
        try {
            await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${id}?user_id=${session?.user?.id}`
            )
            
            // Remove from state
            setApplications(applications.filter(app => app.id !== id))
        } catch {
            setError("Failed to delete application")
        }
    }

    const handleUpdateApplication = async (id: number, formData: ApplicationFormData) => {
        try {
            const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${id}?user_id=${session?.user?.id}`,
            formData
            )
            
            // Update in state
            setApplications(applications.map(app => 
            app.id === id ? response.data : app
            ))
            setShowEditModal(false)
            setSelectedApplication(null)
        } catch {
            setError("Failed to update application")
        }
    }

    const handleEdit = (application: Application) => {
        setSelectedApplication(application)
        setShowEditModal(true)
    }

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(Number(event.active.id))
    }

    const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
        setActiveId(null)
        return
    }
    
    const applicationId = Number(active.id)
    const newStatus = over.id as string
    
    // Find the application
    const application = applications.find(app => app.id === applicationId)
    
    if (!application || application.status === newStatus) {
        setActiveId(null)
        return
    }
    
    // Optimistically update UI
    setApplications(applications.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
    ))
    
    // Update backend
    try {
        await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${applicationId}/status?user_id=${session?.user?.id}&status_value=${newStatus}`
        )
    } catch {
        // Revert on error
        setApplications(applications.map(app =>
        app.id === applicationId ? { ...app, status: application.status } : app
        ))
        setError("Failed to update status")
    }
    
    setActiveId(null)
    }
    
    const getApplicationsByStatus = (status: string) => {
        return applications.filter(app => app.status === status)
    }

  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-gray-600">Loading applications...</p>
        </div>
    )
    }

    return (
    <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Application Tracker</h1>
            <button
            onClick={() => setShowAddModal(true)}
            className="rounded bg-blue-500 px-6 py-2 text-white font-semibold hover:bg-blue-600 transition"
            >
            + Add Application
            </button>
        </div>

        {/* Error Message */}
        {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-center">{error}</p>
            </div>
        )}

        {/* Kanban Board */}
        <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Applied Column */}
            <DroppableColumn
            id="Applied"
            title="Applied"
            count={getApplicationsByStatus('Applied').length}
            color="text-gray-700"
            >
            {getApplicationsByStatus('Applied').map(app => (
                <ApplicationCard 
                key={app.id} 
                application={app} 
                onDelete={handleDeleteApplication} 
                onEdit={handleEdit}
                />
            ))}
            </DroppableColumn>

            {/* Interview Column */}
            <DroppableColumn
            id="Interview"
            title="Interview"
            count={getApplicationsByStatus('Interview').length}
            color="text-blue-700"
            >
            {getApplicationsByStatus('Interview').map(app => (
                <ApplicationCard 
                key={app.id} 
                application={app} 
                onDelete={handleDeleteApplication} 
                onEdit={handleEdit}
                />
            ))}
            </DroppableColumn>

            {/* Offer Column */}
            <DroppableColumn
            id="Offer"
            title="Offer"
            count={getApplicationsByStatus('Offer').length}
            color="text-green-700"
            >
            {getApplicationsByStatus('Offer').map(app => (
                <ApplicationCard 
                key={app.id} 
                application={app} 
                onDelete={handleDeleteApplication} 
                onEdit={handleEdit}
                />
            ))}
            </DroppableColumn>

            {/* Rejected Column */}
            <DroppableColumn
            id="Rejected"
            title="Rejected"
            count={getApplicationsByStatus('Rejected').length}
            color="text-red-700"
            >
            {getApplicationsByStatus('Rejected').map(app => (
                <ApplicationCard 
                key={app.id} 
                application={app} 
                onDelete={handleDeleteApplication} 
                onEdit={handleEdit}
                />
            ))}
            </DroppableColumn>
        </div>
        </DndContext>
        
        {/* Modals will go here */}
        {showAddModal && (
        <AddApplicationModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddApplication}
        />
        )}
        {showEditModal && selectedApplication && (
        <EditApplicationModal
            isOpen={showEditModal}
            onClose={() => {
            setShowEditModal(false)
            setSelectedApplication(null)
            }}
            onUpdate={handleUpdateApplication}
            application={selectedApplication}
        />
        )}
        </div>
    </div>
    )
}