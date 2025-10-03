'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Building2, MapPin, Tag, ExternalLink, Bookmark, ArrowLeft, Phone, Mail, Globe, DollarSign, FileText } from 'lucide-react'
import CompanyCard from '@/components/CompanyCard'
import Badge from '@/components/Badge'
import AdvisorSidebar from '@/components/AdvisorSidebar'
import GoogleMap from '@/components/GoogleMap'
import RealestateGallery from '@/components/RealestateGallery'

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
  views: number
  amountSeeking?: string
  raisingReason?: string
  properties?: string
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
    description?: string
    specialties: string[]
  }
  createdAt: string
}

// Mock related companies data
const relatedCompanies = [
  {
    id: '2',
    name: 'GreenEnergy Solutions',
    slug: 'greenenergy-solutions',
    sector: 'Energy',
    industry: 'Renewable Energy',
    description: 'Renewable energy solutions for commercial and residential properties.',
    logoUrl: undefined,
    websiteUrl: 'https://greenenergy.com',
    suburb: 'Melbourne',
    state: 'VIC',
    tags: ['Renewable Energy', 'Solar', 'Sustainability'],
    photos: [],
    views: 45,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '3',
    name: 'MediCare Plus',
    slug: 'medicare-plus',
    sector: 'Healthcare',
    industry: 'Digital Health',
    description: 'Digital health platform connecting patients with healthcare providers.',
    logoUrl: undefined,
    websiteUrl: 'https://medicareplus.com',
    suburb: 'Brisbane',
    state: 'QLD',
    tags: ['Digital Health', 'Telemedicine', 'Healthcare'],
    photos: [],
    views: 32,
    createdAt: '2024-01-20T14:15:00Z'
  }
]

export default function CompanyDetailPage() {
  const params = useParams()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [savedCompanies, setSavedCompanies] = useState<string[]>([])

  useEffect(() => {
    // Load saved companies from localStorage
    const saved = localStorage.getItem('saved-companies')
    if (saved) {
      setSavedCompanies(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true)
      try {
        // For now, we'll use mock data since we don't have the API set up yet
        // In a real app, this would be: const response = await fetch(`/api/companies/${companyId}`)
        
        // Fetch real company data from API
        const response = await fetch(`/api/companies/${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          console.log('Received company data:', data)
          console.log('Company photos from API:', data.company.photos)
          console.log('Company project photos from API:', data.company.projectPhotos)
          setCompany(data.company)
          setSaved(savedCompanies.includes(data.company.id))
        } else {
          // Fallback to mock data if API fails
          const mockCompany: Company = {
            id: '1',
            name: 'MediTech Innovations',
            slug: 'meditech-innovations',
            sector: 'Healthcare',
            industry: 'Medical Technology',
            subIndustry: 'Diagnostic',
            description: 'MediTech Innovations is a cutting-edge medical technology company specializing in AI-powered diagnostic imaging solutions. Our proprietary algorithms can detect early-stage diseases with 95% accuracy, revolutionizing patient care and reducing healthcare costs. We have a strong IP portfolio with 12 patents and partnerships with major hospitals across Australia.',
            logoUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1031&q=80',
            websiteUrl: 'https://meditech-innovations.com.au',
            email: 'investors@meditech-innovations.com.au',
            phone: '+61 3 1234 5678',
            street: '123 Collins Street',
            suburb: 'Melbourne',
            state: 'VIC',
            postcode: '3000',
            country: 'Australia',
            latitude: -37.8136,
            longitude: 144.9631,
            tags: ['AI', 'Medical Technology', 'Diagnostics', 'Healthcare', 'Innovation'],
            photos: [],
            projectPhotos: [],
            views: 156,
            amountSeeking: '$5M - $10M',
            raisingReason: 'Expansion into international markets and R&D for new diagnostic products',
            properties: 'State-of-the-art R&D facility in Melbourne CBD, manufacturing plant in Dandenong, and clinical testing partnerships with 15 major hospitals.',
            advisor: {
              id: '1',
              firmName: 'Capital Partners Advisory',
              teamLead: 'Sarah Mitchell',
              headshotUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
              email: 'sarah@capitalpartners.com.au',
              phone: '+61 2 9876 5432',
              street: '456 George Street',
              suburb: 'Sydney',
              state: 'NSW',
              postcode: '3000',
              country: 'Australia',
              websiteUrl: 'https://capitalpartners.com.au',
              description: 'Specialized in technology and healthcare investments with over 15 years of experience. We help companies secure growth capital and strategic partnerships.',
              specialties: ['Technology', 'Healthcare', 'SaaS', 'Digital Health', 'AI/ML']
            },
            createdAt: '2024-01-10T09:00:00Z'
          }
          setCompany(mockCompany)
          setSaved(savedCompanies.includes(mockCompany.id))
        }
      } catch (err) {
        setError('Failed to load company details')
        console.error('Error fetching company:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchCompany()
    }
  }, [params.slug, savedCompanies])

  const handleSave = () => {
    if (!company) return
    
    const newSaved = saved ? 
      savedCompanies.filter(id => id !== company.id) : 
      [...savedCompanies, company.id]
    
    setSavedCompanies(newSaved)
    setSaved(!saved)
    localStorage.setItem('saved-companies', JSON.stringify(newSaved))
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Company not found</h1>
          <p className="text-gray-600 mb-6">The company you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/companies"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to companies
          </Link>
        </div>
      </div>
    )
  }

  const location = [company.suburb, company.state, company.country].filter(Boolean).join(', ')
  const fullAddress = [company.street, company.suburb, company.state, company.postcode].filter(Boolean).join(', ')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/companies"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to companies
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Company Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={`${company.name} logo`}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
                  <div className="flex items-center space-x-4">
                    <Badge variant="default">{company.sector}</Badge>
                    <Badge variant="secondary">{company.industry}</Badge>
                    {company.subIndustry && (
                      <Badge variant="outline">{company.subIndustry}</Badge>
                    )}
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {location}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {company.views} views
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  saved 
                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>

            {/* Photo Gallery */}
            {company.photos && company.photos.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Facility & Location</h2>
                <RealestateGallery 
                  images={company.photos.map((url: string, index: number) => {
                    return {
                      src: url,
                      alt: `${company.name} photo ${index + 1}`
                    }
                  })}
                />
              </div>
            ) : (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Facility & Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="col-span-2 row-span-2">
                    <img
                      src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1031"
                      alt="MediTech Innovations headquarters"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500"
                      alt="R&D Laboratory"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500"
                      alt="Manufacturing facility"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500"
                      alt="Team workspace"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500"
                      alt="Clinical testing area"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {company.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">{company.description}</p>
              </div>
            )}

            {/* Equity Raising Details */}
            {(company.amountSeeking || company.raisingReason) && (
              <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-6 w-6 mr-3 text-green-600" />
                  Equity Raising Opportunity
                </h2>
                
                {company.amountSeeking && (
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {company.amountSeeking}
                    </div>
                    <p className="text-gray-600">Amount seeking</p>
                  </div>
                )}

                {company.raisingReason && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Reason for Raising</h3>
                    <p className="text-gray-700">{company.raisingReason}</p>
                  </div>
                )}

                <div className="flex items-center text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg">
                  <FileText className="h-4 w-4 mr-2" />
                  Investment opportunity available
                </div>
              </div>
            )}

            {/* Project Photos */}
            {company.projectPhotos && company.projectPhotos.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Project & Expansion Plans</h2>
                <RealestateGallery 
                  images={company.projectPhotos.map((url: string, index: number) => {
                    return {
                      src: url,
                      alt: `${company.name} project photo ${index + 1}`
                    }
                  })}
                />
              </div>
            )}

            {/* Properties & Assets */}
            {company.properties && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Properties & Assets</h2>
                <p className="text-gray-700 leading-relaxed">{company.properties}</p>
              </div>
            )}

            {/* Tags */}
            {company.tags.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {company.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {company.websiteUrl && (
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Globe className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Website</div>
                    <div className="text-sm text-gray-600">{company.websiteUrl}</div>
                  </div>
                  <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                </a>
              )}

              {company.email && (
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Mail className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-sm text-gray-600">{company.email}</div>
                  </div>
                </a>
              )}

              {company.phone && (
                <a
                  href={`tel:${company.phone}`}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Phone</div>
                    <div className="text-sm text-gray-600">{company.phone}</div>
                  </div>
                </a>
              )}

              {fullAddress && (
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Address</div>
                    <div className="text-sm text-gray-600">{fullAddress}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          {company.latitude && company.longitude && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
              <GoogleMap
                latitude={company.latitude}
                longitude={company.longitude}
                companyName={company.name}
                address={fullAddress}
                className="w-full h-64 rounded-lg"
              />
            </div>
          )}

          {/* Related Companies */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Companies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedCompanies.map((relatedCompany) => (
                <CompanyCard
                  key={relatedCompany.id}
                  company={relatedCompany}
                  onSave={() => {}}
                  onUnsave={() => {}}
                  isSaved={savedCompanies.includes(relatedCompany.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Advisor Sidebar */}
          {company.advisor && (
            <div className="mb-6">
              <AdvisorSidebar advisor={company.advisor} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}