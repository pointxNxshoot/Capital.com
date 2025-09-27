'use client'

import { useState, useEffect } from 'react'
import { Bookmark, Trash2 } from 'lucide-react'
import CompanyCard from '@/components/CompanyCard'
import EmptyState from '@/components/EmptyState'
import { fetchWithRetry } from '@/lib/apiUtils'

interface SavedCompany {
  id: string
  name: string
  slug: string
  sector: string
  industry?: string
  description?: string
  logoUrl?: string
  websiteUrl?: string
  suburb?: string
  state?: string
  tags: string[]
  views: number
  amountSeeking?: string
  photos: string
  projectPhotos: string
  latitude?: number
  longitude?: number
  createdAt: string
}

interface SavedListing {
  id: string
  userId: string
  companyId: string
  createdAt: string
  company: SavedCompany
}

export default function SavedPage() {
  const [savedCompanies, setSavedCompanies] = useState<SavedCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId] = useState('user-123') // In a real app, this would come from authentication

  useEffect(() => {
    loadSavedCompanies()
  }, [])

  const loadSavedCompanies = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching saved listings for user:', userId)
      const response = await fetchWithRetry(`/api/saved?userId=${userId}`)
      console.log('Saved listings response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Failed to fetch saved listings:', response.status, errorText)
        throw new Error(`Failed to fetch saved listings: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Saved listings data:', data)
      
      const companies = data.savedListings.map((saved: SavedListing) => ({
        ...saved.company,
        tags: JSON.parse(saved.company.tags || '[]')
      }))
      
      setSavedCompanies(companies)
    } catch (error) {
      console.error('Error loading saved companies:', error)
      setError('Failed to load saved listings. Please try again.')
      setSavedCompanies([])
    } finally {
      setLoading(false)
    }
  }

  const handleUnsave = async (companyId: string) => {
    try {
      setError(null)
      const response = await fetchWithRetry(`/api/saved?userId=${userId}&companyId=${companyId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Failed to unsave listing:', response.status, errorText)
        throw new Error(`Failed to unsave listing: ${response.status}`)
      }
      
      // Update local state
      const newSaved = savedCompanies.filter(company => company.id !== companyId)
      setSavedCompanies(newSaved)
    } catch (error) {
      console.error('Error unsaving listing:', error)
      setError('Failed to unsave listing. Please try again.')
    }
  }

  const handleSave = (companyId: string) => {
    // This shouldn't happen on the saved page, but keeping for consistency
    console.log('Save clicked for company:', companyId)
  }

  const clearAllSaved = async () => {
    try {
      setError(null)
      // Unsave all listings one by one
      const unsavePromises = savedCompanies.map(company => 
        fetchWithRetry(`/api/saved?userId=${userId}&companyId=${company.id}`, {
          method: 'DELETE'
        })
      )
      
      await Promise.all(unsavePromises)
      setSavedCompanies([])
    } catch (error) {
      console.error('Error clearing all saved listings:', error)
      setError('Failed to clear all saved listings. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bookmark className="h-8 w-8 mr-3 text-blue-600" />
            Saved Companies
          </h1>
          <p className="text-gray-600 mt-2">
            {savedCompanies.length} {savedCompanies.length === 1 ? 'company' : 'companies'} saved
          </p>
        </div>

        {savedCompanies.length > 0 && (
          <button
            onClick={clearAllSaved}
            className="flex items-center px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear all
          </button>
        )}
      </div>

      {/* Content */}
      {savedCompanies.length === 0 ? (
        <EmptyState
          type="no-saved"
          action={{
            label: 'Browse companies',
            onClick: () => window.location.href = '/companies'
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCompanies.map((company) => (
            <div key={company.id} className="relative">
              <CompanyCard
                company={company}
                onSave={handleSave}
                onUnsave={handleUnsave}
                isSaved={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
