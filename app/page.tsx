'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Building2, TrendingUp, Users, MapPin, ArrowRight } from 'lucide-react'
import EnhancedSearchBar from '@/components/EnhancedSearchBar'
import ImprovedCompanyCard from '@/components/ImprovedCompanyCard'

const categories = [
  'Technology',
  'Healthcare', 
  'Finance',
  'Manufacturing',
  'Retail',
  'Real Estate'
]

const cities = [
  'Sydney',
  'Melbourne',
  'Brisbane',
  'Perth',
  'Adelaide',
  'Canberra'
]

// Mock featured companies data (will be replaced with real data)
const featuredCompanies = [
  {
    id: '1',
    name: 'MediTech Innovations',
    slug: 'meditech-innovations',
    sector: 'Healthcare',
    industry: 'Medical Devices',
    description: 'AI-powered diagnostic imaging solutions with 95% accuracy in early disease detection.',
    logoUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200',
    websiteUrl: 'https://meditech-innovations.com.au',
    suburb: 'Melbourne',
    state: 'VIC',
    tags: ['AI', 'Medical Devices', 'Diagnostic'],
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop'
    ],
    views: 1247,
    amountSeeking: '$15M - $25M',
    advisor: {
      firmName: 'Deloitte',
      teamLead: 'Sarah Chen',
      headshotUrl: 'https://www.deloitte.com/global/en/about/people/profiles.prenjen+6060c044.html',
      email: 'sarah.chen@deloitte.com.au',
      phone: '+61 3 9671 7000'
    }
  },
  {
    id: '2', 
    name: 'GreenEnergy Solutions',
    slug: 'greenenergy-solutions',
    sector: 'Energy',
    industry: 'Renewable',
    description: 'Commercial solar energy solutions with proprietary battery storage technology.',
    logoUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=200',
    websiteUrl: 'https://greenenergy-solutions.com.au',
    suburb: 'Sydney',
    state: 'NSW',
    tags: ['Renewable Energy', 'Solar', 'Battery Storage'],
    photos: [
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1509391366360-2e959b79e79d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&h=800&fit=crop'
    ],
    views: 892,
    amountSeeking: '$8M - $12M'
  },
  {
    id: '3',
    name: 'FinTech Dynamics',
    slug: 'fintech-dynamics',
    sector: 'Technology',
    industry: 'Financial Services',
    description: 'Blockchain-based payment processing platform for small businesses.',
    logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
    websiteUrl: 'https://fintech-dynamics.com.au',
    suburb: 'Brisbane',
    state: 'QLD',
    tags: ['FinTech', 'Blockchain', 'Payments'],
    photos: [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop'
    ],
    views: 1563,
    amountSeeking: '$5M - $8M',
    advisor: {
      firmName: 'Deloitte',
      teamLead: 'Michael Rodriguez',
      headshotUrl: 'https://www.deloitte.com/global/en/about/people/profiles.prenjen+6060c044.html',
      email: 'michael.rodriguez@deloitte.com.au',
      phone: '+61 7 3308 7000'
    }
  }
]

export default function Home() {
  const [savedCompanies, setSavedCompanies] = useState<string[]>([])

  useEffect(() => {
    // Load saved companies from localStorage
    const saved = localStorage.getItem('saved-companies')
    if (saved) {
      setSavedCompanies(JSON.parse(saved))
    }
  }, [])

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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2070')"
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/80" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Find Your Next
                  <span className="text-blue-300"> Equity Partner</span>
                </h1>
                <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                  Connect companies seeking equity investment with private equity firms.
                  Take your business to the next level.
                </p>
            
            {/* Hero Search */}
            <div className="max-w-2xl mx-auto mb-12">
              <EnhancedSearchBar 
                variant="hero" 
                placeholder="Search companies by name, category, or location..." 
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-blue-100">Companies Listed</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">150+</div>
                <div className="text-blue-100">Successful Matches</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-blue-100">PE Firms</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-600">Find companies in your area of interest</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/companies?sector=${encodeURIComponent(category)}`}
                className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 text-center transition-colors group min-h-[120px] flex flex-col justify-center"
              >
                <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 mb-2 break-words">
                  {category}
                </div>
                <div className="text-xs text-gray-500">View companies</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Cities</h2>
            <p className="text-gray-600">Discover companies in major Australian cities</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cities.map((city) => (
              <Link
                key={city}
                href={`/companies?q=${encodeURIComponent(city)}`}
                className="bg-white hover:bg-blue-50 rounded-lg p-4 text-center transition-colors group border border-gray-200"
              >
                <MapPin className="h-5 w-5 text-gray-400 mx-auto mb-2 group-hover:text-blue-600" />
                <div className="font-medium text-gray-900 group-hover:text-blue-600">{city}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Advisor Promotion Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Looking for an advisor?</h2>
            <p className="text-lg text-gray-600">Gain guidance from industry experts</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Deloitte', logo: 'https://unglobalcompact.org.au/our-members/deloitte-australia/' },
              { name: 'TCA Partners', logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200' },
              { name: 'Saffron Partners', logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
              { name: 'BCMG', logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200' }
            ].map((advisor) => (
              <div
                key={advisor.name}
                className="bg-gray-50 hover:bg-blue-50 rounded-xl p-6 text-center transition-colors group cursor-pointer"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src={advisor.logo}
                    alt={`${advisor.name} logo`}
                    className="w-10 h-10 object-contain rounded-full"
                  />
                </div>
                <div className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {advisor.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Investment Advisory
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Companies</h2>
              <p className="text-gray-600">Recently listed companies seeking equity investment</p>
            </div>
            <Link
              href="/companies"
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View all companies
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCompanies.map((company) => (
              <ImprovedCompanyCard
                key={company.id}
                company={company}
                onSave={handleSave}
                isSaved={savedCompanies.includes(company.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to List Your Company?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies already listed on our platform. 
            It's free to list and takes just a few minutes.
          </p>
          <Link
            href="/list"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            List Your Company
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
