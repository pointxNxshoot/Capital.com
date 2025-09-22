'use client'

import Link from 'next/link'
import { Building2, MapPin, Tag, ExternalLink, Bookmark } from 'lucide-react'
import { useState } from 'react'

interface Company {
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
}

interface CompanyCardProps {
  company: Company
  onSave?: (companyId: string) => void
  onUnsave?: (companyId: string) => void
  isSaved?: boolean
}

export default function CompanyCard({ 
  company, 
  onSave, 
  onUnsave, 
  isSaved = false 
}: CompanyCardProps) {
  const [saved, setSaved] = useState(isSaved)

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (saved) {
      onUnsave?.(company.id)
    } else {
      onSave?.(company.id)
    }
    setSaved(!saved)
  }

  const location = [company.suburb, company.state].filter(Boolean).join(', ')

  return (
    <Link href={`/companies/${company.slug}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={`${company.name} logo`}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {company.name}
              </h3>
              <p className="text-sm text-blue-600 font-medium">{company.sector}</p>
              {company.industry && (
                <p className="text-xs text-gray-500">{company.industry}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={handleSave}
            className={`p-2 rounded-full transition-colors ${
              saved 
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                : 'text-gray-400 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {company.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {company.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {location && (
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <span>{company.views} views</span>
            </div>
          </div>

          {company.websiteUrl && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open(company.websiteUrl, '_blank', 'noopener,noreferrer')
              }}
              className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-gray-100"
              title="Visit company website"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Amount Seeking */}
        {company.amountSeeking && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Seeking:</span>
              <span className="text-lg font-bold text-green-600">{company.amountSeeking}</span>
            </div>
          </div>
        )}

        {company.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {company.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {company.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{company.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
