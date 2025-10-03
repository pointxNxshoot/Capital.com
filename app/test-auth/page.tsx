"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function TestAuthPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test Page</h1>
                    
                    {session ? (
                        <div className="space-y-6">
                            <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                <h2 className="text-lg font-medium text-green-800 mb-2">✅ Successfully Authenticated!</h2>
                                <p className="text-green-700">You are signed in to your account.</p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-md p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">User Information:</h3>
                                <div className="space-y-2">
                                    <p><strong>Name:</strong> {session.user?.name || "Not provided"}</p>
                                    <p><strong>Email:</strong> {session.user?.email || "Not provided"}</p>
                                    <p><strong>User ID:</strong> {(session.user as any)?.id || "Not available"}</p>
                                    {session.user?.image && (
                                        <div className="flex items-center space-x-2">
                                            <strong>Profile Image:</strong>
                                            <img 
                                                src={session.user.image} 
                                                alt="Profile" 
                                                className="w-8 h-8 rounded-full"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Available Actions:</h3>
                                <div className="flex space-x-4">
                                    <Link
                                        href="/"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Go to Home
                                    </Link>
                                    <Link
                                        href="/api/auth/signin"
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                    >
                                        Sign In Page
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <h4 className="text-sm font-medium text-blue-800 mb-2">🔍 Error Handling Features:</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Real-time email validation (checks if account exists)</li>
                                    <li>• Specific error messages for different scenarios</li>
                                    <li>• "Account doesn't exist" for non-existent emails</li>
                                    <li>• "Invalid password" for wrong passwords</li>
                                    <li>• Visual feedback with loading indicators</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                <h2 className="text-lg font-medium text-yellow-800 mb-2">⚠️ Not Authenticated</h2>
                                <p className="text-yellow-700">You are not signed in. Please sign in to test the authentication features.</p>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Get Started:</h3>
                                <div className="flex space-x-4">
                                    <Link
                                        href="/api/auth/signin"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/api/auth/signup"
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
