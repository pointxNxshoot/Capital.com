'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { listingService } from '@/lib/listingService'
import EditListingFormWithPhotos from '@/components/EditListingFormWithPhotos'

interface Company {
  id: string
  name: string
  slug: string
  sector: string
  industry: string
  subIndustry?: string
  description?: string
  logoUrl?: string
  websiteUrl?: string
  email?: string
  phone?: string
  street?: string
  suburb?: string
  state?: string
  postcode?: string
  country: string
  latitude?: number
  longitude?: number
  tags: string[]
  photos: string[]
  projectPhotos: string[]
  amountSeeking?: string
  raisingReason?: string
  properties?: string
  advisorId?: string
  status: string
  views: number
  createdAt: string
  updatedAt: string
}

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [listing, setListing] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const router = useRouter()

  // Simple user ID management - in a real app, this would come from authentication
  useEffect(() => {
    let storedUserId = localStorage.getItem('userId')
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('userId', storedUserId)
    }
    setUserId(storedUserId)
  }, [])

  useEffect(() => {
    if (userId && resolvedParams.id) {
      fetchListing()
    }
  }, [userId, resolvedParams.id])

  const fetchListing = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await listingService.getById(resolvedParams.id, userId)
      setListing(data)
    } catch (err) {
      console.error('Error fetching listing:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData: any) => {
    try {
      setSaving(true)
      setError(null)
      
      // The formData already includes processed photos, tags, and other data
      // Just add the createdBy field and update
      const updateData = {
        ...formData,
        createdBy: userId
      }
      
      await listingService.update(resolvedParams.id, updateData, userId)
      alert('Listing updated successfully!')
      router.push('/my-listings')
    } catch (err) {
      console.error('Error updating listing:', err)
      setError(err instanceof Error ? err.message : 'Failed to update listing')
      alert(`Error updating listing: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading listing...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-6">
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
                  <Link
                    href="/my-listings"
                    className="text-sm font-medium text-red-800 hover:text-red-600"
                  >
                    ← Back to My Listings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h1>
            <Link
              href="/my-listings"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to My Listings
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Listing</h1>
              <p className="text-gray-600">Update your company listing details</p>
            </div>
            <Link
              href="/my-listings"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to My Listings
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <EditListingFormWithPhotos
            initialData={listing}
            onSave={handleSave}
            saving={saving}
          />
        </div>
      </div>
    </div>
  )
}
