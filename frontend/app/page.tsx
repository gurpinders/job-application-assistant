'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('Loading...')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    // Fetch data from our FastAPI backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/`)
      .then(response => response.json())
      .then(data => {
        setMessage(data.message)
        setStatus(data.status)
      })
      .catch(error => {
        console.error('Error:', error)
        setMessage('Failed to connect to backend')
        setStatus('error')
      })
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">
        Job Application Assistant
      </h1>
      
      <div className="border rounded-lg p-6 bg-white shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Backend Status:</h2>
        <p className="text-gray-700">Message: {message}</p>
        <p className="text-gray-700">Status: {status}</p>
        
        {status === 'running' && (
          <p className="text-green-600 mt-4">✅ Frontend and Backend Connected!</p>
        )}
      </div>
    </main>
  )
}