'use client'

import Link from 'next/link'
import { Search, Building2, Plus, Tag, Bookmark } from 'lucide-react'
import EnhancedSearchBar from './EnhancedSearchBar'
import AuthNav from './AuthNav'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">GetCapital.com</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-12 ml-8">
            <Link 
              href="/companies" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Browse Companies
            </Link>
            <Link 
              href="/list" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              List Your Company
            </Link>
            <Link 
              href="/saved" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Saved
            </Link>
            <Link 
              href="/my-listings" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              My Listings
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <EnhancedSearchBar />
          </div>

          {/* Auth Navigation */}
          <div className="hidden md:block">
            <AuthNav />
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
