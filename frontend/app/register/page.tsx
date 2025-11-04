'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        setError('')
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
                {
                    email: formData.email,
                    full_name: formData.fullName,
                    password: formData.password
                }
            )
            router.push('/login');
            
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
            const detail = error.response.data.detail;
            
                if (typeof detail === 'string') {
                    setError(detail);
                } 
                // If it's an array of validation errors, get first message
                else if (Array.isArray(detail) && detail.length > 0) {
                    setError(detail[0].msg || 'Registration failed');
                } 
                // Fallback
                else {
                    setError('Registration failed');
                }
            } else {
            setError('An unexpected error occurred');
            }
        } finally{
            setLoading(false);
        }
    }
    return(
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
                <h2 className="text-center text-3xl font-bold text-gray-900">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="rounded bg-red-100 p-3 text-red-700">
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            id="email" 
                            type="email" 
                            required 
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input 
                            id="fullName" 
                            type="text" 
                            required 
                            value={formData.fullName} 
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            id="password" 
                            type="password" 
                            required 
                            value={formData.password} 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"> 
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    )
}

