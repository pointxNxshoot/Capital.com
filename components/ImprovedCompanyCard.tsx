'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, MapPin, Tag, ExternalLink, Bookmark } from 'lucide-react'
import { getBestImageForContainer, ASPECT_RATIOS, type ProcessedImage } from '@/lib/imageUtils'

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
  amountSeeking?: string
  advisor?: {
    id: string
    firmName: string
    teamLead: string
    headshotUrl?: string
    email: string
    phone: string
    street?: string
    suburb?: string
    state?: string
    postcode?: string
    country: string
    websiteUrl?: string
  }
}

interface ImprovedCompanyCardProps {
  company: Company
  onSave?: (companyId: string) => void
  isSaved?: boolean
}

export default function ImprovedCompanyCard({ company, onSave, isSaved = false }: ImprovedCompanyCardProps) {
  const [saved, setSaved] = useState(isSaved)

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSaved(!saved)
    onSave?.(company.id)
  }

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (company.websiteUrl) {
      window.open(company.websiteUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // Get the first photo URL
  const firstPhotoUrl = company.photos && company.photos.length > 0 ? company.photos[0] : ''

  return (
    <Link href={`/companies/${company.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
        {/* Photo */}
        <div 
          className="relative bg-gray-200 overflow-hidden"
          style={{ aspectRatio: ASPECT_RATIOS.CARD }}
        >
          {firstPhotoUrl ? (
            <img
              src={firstPhotoUrl}
              alt={`${company.name} photo`}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              style={{ imageRendering: 'high-quality' }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          {/* Photo count overlay */}
          {company.photos && company.photos.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {company.photos.length} photos
            </div>
          )}
          
          {/* Save button */}
          <button
            onClick={handleSave}
            className="absolute top-2 left-2 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <Bookmark className={`h-4 w-4 ${saved ? 'fill-current text-blue-600' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                {company.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {company.industry} • {company.suburb}, {company.state}
              </p>
            </div>
            {company.websiteUrl && (
              <button
                onClick={handleWebsiteClick}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Visit website"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
          </div>

          {company.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {company.description}
            </p>
          )}

          {/* Tags */}
          {company.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {company.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
              {company.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{company.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Amount seeking */}
          {company.amountSeeking && (
            <div className="flex items-center text-sm text-green-600 font-medium mb-2">
              <span className="mr-1">$</span>
              {company.amountSeeking}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{company.views} views</span>
            {company.advisor && (
              <span className="text-blue-600">Advisor available</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
