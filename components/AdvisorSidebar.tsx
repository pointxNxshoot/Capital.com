'use client'

import { User, Mail, Phone, Globe, MapPin, Building2 } from 'lucide-react'

interface Advisor {
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
  description?: string
  specialties: string[]
}

interface AdvisorSidebarProps {
  advisor: Advisor
}

export default function AdvisorSidebar({ advisor }: AdvisorSidebarProps) {
  const location = [advisor.suburb, advisor.state, advisor.country].filter(Boolean).join(', ')
  const fullAddress = [advisor.street, advisor.suburb, advisor.state, advisor.postcode].filter(Boolean).join(', ')

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Advisor</h3>
        <div className="flex items-center justify-center mb-4">
          {advisor.headshotUrl ? (
            <img
              src={advisor.headshotUrl}
              alt={`${advisor.teamLead} headshot`}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        <h4 className="text-lg font-semibold text-gray-900">{advisor.teamLead}</h4>
        <p className="text-blue-600 font-medium">{advisor.firmName}</p>
      </div>

      {/* Contact Information */}
      <div className="space-y-4 mb-6">
        {advisor.email && (
          <a
            href={`mailto:${advisor.email}`}
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Mail className="h-4 w-4 mr-3 text-gray-400" />
            {advisor.email}
          </a>
        )}

        {advisor.phone && (
          <a
            href={`tel:${advisor.phone}`}
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Phone className="h-4 w-4 mr-3 text-gray-400" />
            {advisor.phone}
          </a>
        )}

        {advisor.websiteUrl && (
          <a
            href={advisor.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Globe className="h-4 w-4 mr-3 text-gray-400" />
            Visit website
          </a>
        )}

        {location && (
          <div className="flex items-start text-gray-700">
            <MapPin className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-gray-400" />
            <span>{location}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {advisor.description && (
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-900 mb-2">About</h5>
          <p className="text-sm text-gray-600">{advisor.description}</p>
        </div>
      )}

      {/* Specialties */}
      {advisor.specialties.length > 0 && (
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Specialties</h5>
          <div className="flex flex-wrap gap-2">
            {advisor.specialties.map((specialty, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact Now Button */}
      <div className="space-y-3">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Contact Now
        </button>
        
        <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
          Save Contact
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <Building2 className="h-4 w-4 mr-2" />
          <span>Verified Advisor</span>
        </div>
      </div>
    </div>
  )
}
