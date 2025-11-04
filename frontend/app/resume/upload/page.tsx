'use client'

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ResumeUploadPage(){
    const [selectedFile, setSelectedFile] = useState<File|null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const { data: session } = useSession();
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files){
            return null;
        }
        const file = e.target.files[0];
        if(file){
            setSelectedFile(file);
            setError('');
        }
    }

    const handleUpload = async () => {
        if(!selectedFile){
            setError("Please select a file");
            return null;
        }
        if(!session?.user?.id){
            setError("You must be logged in");
            return null;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/upload?user_id=${session.user.id}`, formData);
            router.push(`/resume/${response.data.id}`);
        } catch {
            setError("Failed to upload resume. Please try again.");
        } finally {
            setUploading(false);
        }
    }
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Upload Your Resume</h1>
                <div className="mb-4">
                    <input type="file" accept=".pdf .docx" onChange={handleFileChange} className="w-full p-2 border rounded cursor-pointer text-gray-900"/>
                </div>
                
                {selectedFile?.name && (<p className="text-sm text-gray-600 mb-4 truncate">Selected: {selectedFile.name}</p>)}
                <button disabled={uploading || !selectedFile} onClick={handleUpload} className="w-full bg-blue-500 text-white py-2 px-4 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
                {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
            </div>
        </div>
    )
}

