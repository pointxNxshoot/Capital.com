'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Grid, List, SortAsc } from 'lucide-react'
import ImprovedCompanyCard from '@/components/ImprovedCompanyCard'
import Filters from '@/components/Filters'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/Pagination'

interface Company {
  id: string
  name: string
  slug: string
  sector: string
  industry: string
  description?: string
  logoUrl?: string
  websiteUrl?: string
  suburb?: string
  state?: string
  tags: string[]
  photos: string[]
  views: number
  createdAt: string
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

interface SearchResponse {
  companies: Company[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const categories = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Education',
  'Energy',
  'Transportation',
  'Other'
]

const states = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'ACT',
  'NT'
]

const commonTags = [
  'Startup',
  'Growth Stage',
  'Mature',
  'Family Business',
  'Tech Enabled',
  'E-commerce',
  'B2B',
  'B2C',
  'SaaS',
  'Manufacturing'
]

export default function CompaniesPage() {
  const searchParams = useSearchParams()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [savedCompanies, setSavedCompanies] = useState<string[]>([])

  // Filter states
  const [selectedSector, setSelectedSector] = useState(searchParams.get('sector') || '')
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))

  useEffect(() => {
    // Load saved companies from localStorage
    const saved = localStorage.getItem('saved-companies')
    if (saved) {
      setSavedCompanies(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    fetchCompanies()
  }, [selectedSector, selectedState, selectedTags, sortBy, currentPage, searchParams])

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchParams.get('q')) params.set('q', searchParams.get('q')!)
      if (selectedSector) params.set('sector', selectedSector)
      if (selectedState) params.set('state', selectedState)
      if (selectedTags.length > 0) params.set('tags', selectedTags.join(','))
      params.set('sort', sortBy)
      params.set('page', currentPage.toString())
      params.set('limit', '20')

      const response = await fetch(`/api/companies?${params}`)
      if (response.ok) {
        const data: SearchResponse = await response.json()
        setCompanies(data.companies)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector === selectedSector ? '' : sector)
    setCurrentPage(1)
  }

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setCurrentPage(1)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    setSelectedTags(newTags)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSelectedSector('')
    setSelectedState('')
    setSelectedTags([])
    setCurrentPage(1)
  }

  const handleSave = (companyId: string) => {
    const newSaved = [...savedCompanies, companyId]
    setSavedCompanies(newSaved)
    localStorage.setItem('saved-companies', JSON.stringify(newSaved))
  }

  const handleUnsave = (companyId: string) => {
    const newSaved = savedCompanies.filter(id => id !== companyId)
    setSavedCompanies(newSaved)
    localStorage.setItem('saved-companies', JSON.stringify(newSaved))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <Filters
            categories={categories}
            states={states}
            tags={commonTags}
            selectedSector={selectedSector}
            selectedState={selectedState}
            selectedTags={selectedTags}
            onSectorChange={handleSectorChange}
            onStateChange={handleStateChange}
            onTagToggle={handleTagToggle}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {searchParams.get('q') ? `Search results for "${searchParams.get('q')}"` : 'Browse Companies'}
              </h1>
              <p className="text-gray-600">
                {pagination.total} companies found
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="relevance">Relevance</option>
                <option value="name">Name A-Z</option>
                <option value="views">Most Viewed</option>
              </select>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {companies.length === 0 ? (
            <EmptyState
              type="no-results"
              action={{
                label: 'Clear filters',
                onClick: handleClearFilters
              }}
            />
          ) : (
            <>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {companies.map((company) => (
                  <ImprovedCompanyCard
                    key={company.id}
                    company={company}
                    onSave={handleSave}
                    isSaved={savedCompanies.includes(company.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
