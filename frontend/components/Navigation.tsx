'use client'

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navigation(){
    const { data: session } = useSession();
    const router = useRouter();

    return(
        <div className="max-w-full bg-gray-50 p-8 flex justify-between items-center mb-8">
            <Link href={"/"} className="text-2xl font-bold text-blue-600 hover:text-blue-700">Job Application Assistant</Link>
            {session && (
                <div className="flex gap-6">
                    <Link href={"/"} className="text-gray-900 font-medium hover:text-blue-600">Home</Link>
                    <Link href={"/resume/upload"} className="text-gray-900 font-medium hover:text-blue-600">Upload Resume</Link>
                    <Link href="/cover-letter/generate" className="text-gray-900 font-medium hover:text-blue-600">Cover Letter</Link>
                    <Link href="/job-match" className="text-gray-900 font-medium hover:text-blue-600">Job Match</Link>
                    <Link href="/ats-check" className="text-gray-900 font-medium hover:text-blue-600">ATS Check</Link>
                    <Link href="/applications" className="text-gray-900 font-medium hover:text-blue-600">Applications</Link>
                    <Link href={"/dashboard"} className="text-gray-900 font-medium hover:text-blue-600">Dashboard</Link>
                </div>
            )}
            {session ? (
                <div className="flex gap-6">
                    <span className="text-gray-700">Hello, {session.user?.name}</span>
                    <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Sign Out</button>
                </div>
            ) : (<Link href={"/login"} className="text-gray-900 font-medium hover:text-blue-600">Login</Link>)}
        </div>
    )
}
