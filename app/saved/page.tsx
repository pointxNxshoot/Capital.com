'use client'

import { useState, useEffect } from 'react'
import { Bookmark, Trash2 } from 'lucide-react'
import CompanyCard from '@/components/CompanyCard'
import EmptyState from '@/components/EmptyState'

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
  photos: string[]
  views: number
  amountSeeking?: string
  advisor?: {
    id?: string
    firmName: string
    teamLead: string
    headshotUrl?: string
    email: string
    phone: string
    street?: string
    suburb?: string
    state?: string
    postcode?: string
    country?: string
    websiteUrl?: string
    description?: string
    specialties?: string[]
    status?: string
    createdAt?: string
    updatedAt?: string
  }
}

export default function SavedPage() {
  const [savedCompanies, setSavedCompanies] = useState<SavedCompany[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSavedCompanies()
  }, [])

  const loadSavedCompanies = async () => {
    setLoading(true)
    try {
      const savedIds = localStorage.getItem('saved-companies')
      if (!savedIds) {
        setSavedCompanies([])
        return
      }

      const companyIds = JSON.parse(savedIds)
      
      // For now, we'll use mock data since we don't have the API set up yet
      // In a real app, this would fetch from the API
      const mockCompanies: SavedCompany[] = [
        {
          id: '1',
          name: 'TechFlow Solutions',
          slug: 'techflow-solutions',
          sector: 'Technology',
          industry: 'Software',
          photos: [],
          description: 'AI-powered workflow automation platform for enterprise clients.',
          logoUrl: undefined,
          websiteUrl: 'https://techflow.com',
          suburb: 'Sydney',
          state: 'NSW',
          tags: ['SaaS', 'AI', 'B2B'],
          views: 245
        },
        {
          id: '2',
          name: 'GreenEnergy Co',
          slug: 'greenenergy-co',
          sector: 'Energy',
          industry: 'Renewable Energy',
          photos: [],
          description: 'Renewable energy solutions for commercial and residential properties.',
          logoUrl: undefined,
          websiteUrl: 'https://greenenergy.com',
          suburb: 'Melbourne',
          state: 'VIC',
          tags: ['Renewable', 'Sustainability', 'B2B'],
          views: 189
        }
      ]

      // Filter to only show saved companies
      const saved = mockCompanies.filter(company => companyIds.includes(company.id))
      setSavedCompanies(saved)
    } catch (error) {
      console.error('Error loading saved companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnsave = (companyId: string) => {
    const newSaved = savedCompanies.filter(company => company.id !== companyId)
    setSavedCompanies(newSaved)
    
    // Update localStorage
    const savedIds = newSaved.map(company => company.id)
    localStorage.setItem('saved-companies', JSON.stringify(savedIds))
  }

  const handleSave = (companyId: string) => {
    // This shouldn't happen on the saved page, but keeping for consistency
    console.log('Save clicked for company:', companyId)
  }

  const clearAllSaved = () => {
    setSavedCompanies([])
    localStorage.removeItem('saved-companies')
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
