"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthNav() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
        );
    }

    if (session) {
        return (
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    {session.user?.image && (
                        <img
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="w-8 h-8 rounded-full"
                        />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                        {session.user?.name || session.user?.email}
                    </span>
                </div>
                <button
                    onClick={() => signOut()}
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                    Sign out
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-4">
            <Link
                href="/api/auth/signin"
                className="text-sm text-gray-700 hover:text-gray-900"
            >
                Sign in
            </Link>
            <Link
                href="/api/auth/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
                Sign up
            </Link>
        </div>
    );
}
