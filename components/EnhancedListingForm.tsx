'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { listingFormSchema, type ListingFormInput } from '@/lib/validators'
import { Building2, Upload, X, User, MapPin, DollarSign, FileText } from 'lucide-react'
import ImageUpload from './ImageUpload'
import ImageCropUpload from './ImageCropUpload'
import InstagramCropUpload from './InstagramCropUpload'
import ImprovedPhotoUploadManager from './ImprovedPhotoUploadManager'

const sectors = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Education',
  'Energy',
  'Transportation',
  'Agriculture',
  'Other'
]

const industries = {
  'Technology': ['Software', 'Hardware', 'AI/ML', 'Cybersecurity', 'Fintech', 'Edtech', 'Other'],
  'Healthcare': ['Medical Devices', 'Pharmaceuticals', 'Digital Health', 'Biotech', 'Telemedicine', 'Other'],
  'Finance': ['Banking', 'Investment', 'Insurance', 'Wealth Management', 'Cryptocurrency', 'Other'],
  'Manufacturing': ['Automotive', 'Electronics', 'Food & Beverage', 'Textiles', 'Machinery', 'Other'],
  'Retail': ['E-commerce', 'Fashion', 'Electronics', 'Home & Garden', 'Food & Beverage', 'Other'],
  'Real Estate': ['Development', 'Property Management', 'Real Estate Tech', 'Construction', 'Other'],
  'Education': ['Edtech', 'Training', 'Online Learning', 'Educational Services', 'Other'],
  'Energy': ['Renewable', 'Oil & Gas', 'Utilities', 'Energy Storage', 'Other'],
  'Transportation': ['Logistics', 'Automotive', 'Aviation', 'Maritime', 'Other'],
  'Agriculture': ['Crop Production', 'Livestock', 'AgTech', 'Food Processing', 'Aquaculture', 'Other'],
  'Other': ['Consulting', 'Professional Services', 'Entertainment', 'Other']
}

const subIndustries = {
  'Software': ['SaaS', 'Mobile Apps', 'Enterprise Software', 'Gaming', 'Other'],
  'Medical Devices': ['Diagnostic', 'Therapeutic', 'Surgical', 'Monitoring', 'Other'],
  'Digital Health': ['Telemedicine', 'Health Apps', 'Wearables', 'AI Diagnostics', 'Other'],
  'Banking': ['Commercial', 'Investment', 'Retail', 'Digital Banking', 'Other'],
  'E-commerce': ['Marketplace', 'D2C', 'B2B', 'Subscription', 'Other'],
  'Crop Production': ['Grains', 'Fruits', 'Vegetables', 'Nuts', 'Other'],
  'Livestock': ['Cattle', 'Poultry', 'Pigs', 'Sheep', 'Other'],
  'AgTech': ['Precision Agriculture', 'Farm Management Software', 'IoT Sensors', 'Other']
}

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

const amountRanges = [
  'Under $500K',
  '$500K - $1M',
  '$1M - $5M',
  '$5M - $10M',
  '$10M - $25M',
  '$25M - $50M',
  'Over $50M'
]

const raisingReasons = [
  'Expansion',
  'Working Capital',
  'Acquisition',
  'R&D',
  'Equipment Purchase',
  'Market Entry',
  'Debt Refinancing',
  'Other'
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

export default function EnhancedListingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hasAdvisor, setHasAdvisor] = useState<boolean | null>(null)
  const [selectedSector, setSelectedSector] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [advisorSpecialties, setAdvisorSpecialties] = useState<string[]>([])
  const [companyLogo, setCompanyLogo] = useState<File | null>(null)
  const [advisorHeadshot, setAdvisorHeadshot] = useState<File | null>(null)
  const [companyPhotos, setCompanyPhotos] = useState<any[]>([])
  const [projectPhotos, setProjectPhotos] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ListingFormInput>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      country: 'Australia',
      advisorCountry: 'Australia',
      tags: [],
      specialties: []
    }
  })

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    setSelectedTags(newTags)
    setValue('tags', newTags)
  }

  const handleAdvisorSpecialtyToggle = (specialty: string) => {
    const newSpecialties = advisorSpecialties.includes(specialty)
      ? advisorSpecialties.filter(s => s !== specialty)
      : [...advisorSpecialties, specialty]
    
    setAdvisorSpecialties(newSpecialties)
    setValue('specialties', newSpecialties)
  }

  const onSubmit = async (data: ListingFormInput) => {
    setIsSubmitting(true)
    
    try {
      // Convert uploaded images to base64 for now (in production, upload to cloud storage)
      let logoUrl = data.logoUrl
      if (companyLogo) {
        const reader = new FileReader()
        logoUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(companyLogo)
        })
      }

      let headshotUrl = data.headshotUrl
      if (advisorHeadshot) {
        const reader = new FileReader()
        headshotUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(advisorHeadshot)
        })
      }

        // Convert company photos to base64 with different resolutions
        // Convert company photos to base64 using the card preset
        const companyPhotosUrls = companyPhotos.map(photo => photo.processed.card)
        
        // Convert project photos to base64 using the card preset
        const projectPhotosUrls = projectPhotos.map(photo => photo.processed.card)

      // First, create advisor if they have one
      let advisorId = null
      if (hasAdvisor && data.firmName) {
        const advisorResponse = await fetch('/api/advisors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firmName: data.firmName,
            teamLead: data.teamLead,
            headshotUrl: headshotUrl,
            email: data.advisorEmail,
            phone: data.advisorPhone,
            street: data.advisorStreet,
            suburb: data.advisorSuburb,
            state: data.advisorState,
            postcode: data.advisorPostcode,
            country: data.advisorCountry,
            websiteUrl: data.advisorWebsiteUrl,
            description: data.advisorDescription,
            specialties: advisorSpecialties,
          }),
        })

        if (advisorResponse.ok) {
          const advisorData = await advisorResponse.json()
          advisorId = advisorData.advisor.id
        }
      }

      // Then create the company
      const companyData = {
        name: data.name,
        sector: data.sector,
        industry: data.industry || (data.sector === 'Other' ? 'Other' : ''),
        subIndustry: data.subIndustry,
        description: data.description,
        logoUrl: logoUrl,
        websiteUrl: data.websiteUrl,
        email: data.email,
        phone: data.phone,
        street: data.street,
        suburb: data.suburb,
        state: data.state,
        postcode: data.postcode,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        tags: selectedTags,
        amountSeeking: data.amountSeeking,
        raisingReason: data.raisingReason,
        properties: data.properties,
        photos: companyPhotosUrls,
        projectPhotos: projectPhotosUrls,
        advisorId: advisorId,
      }

      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        reset()
        setSelectedTags([])
        setAdvisorSpecialties([])
        setHasAdvisor(null)
        setSelectedSector('')
        setSelectedIndustry('')
      } else {
        throw new Error('Failed to submit listing')
      }
    } catch (error) {
      console.error('Error submitting listing:', error)
      alert('Failed to submit listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Your company listing has been submitted for review. We'll notify you once it's approved and published.
          {hasAdvisor && " We'll also connect you with potential advisors."}
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Another Listing
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Company</h1>
        <p className="text-gray-600">
          Submit your company for equity investment opportunities
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Advisor Question */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Do you have an advisor?
          </h2>
          <p className="text-gray-600 mb-4">
            If you have a financial advisor or investment firm representing you, we can include their details to help potential investors connect with them directly.
          </p>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setHasAdvisor(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                hasAdvisor === true
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Yes, I have an advisor
            </button>
            <button
              type="button"
              onClick={() => setHasAdvisor(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                hasAdvisor === false
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              No, I'll proceed without one
            </button>
          </div>
        </div>

        {/* Advisor Details */}
        {hasAdvisor === true && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Advisor Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Firm Name *
                </label>
                <input
                  {...register('firmName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Investment Partners Pty Ltd"
                />
                {errors.firmName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firmName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Lead *
                </label>
                <input
                  {...register('teamLead')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Smith"
                />
                {errors.teamLead && (
                  <p className="mt-1 text-sm text-red-600">{errors.teamLead.message}</p>
                )}
              </div>
            </div>

            {/* Advisor Headshot Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Lead Headshot
                  </label>
                  <ImprovedPhotoUploadManager
                    onPhotosChange={(photos) => {
                      if (photos.length > 0) {
                        setAdvisorHeadshot(photos[0].file)
                      } else {
                        setAdvisorHeadshot(null)
                      }
                    }}
                    maxPhotos={1}
                    aspectRatio={0.8}
                    minDimensions={{ width: 200, height: 160 }}
                    className="w-full max-w-xs"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a professional headshot. Minimum size: 200×160px. Click to crop and focus on the face.
                  </p>
                </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headshot URL
                </label>
                <input
                  {...register('headshotUrl')}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/headshot.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('advisorDescription')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of the advisor firm..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  {...register('advisorEmail')}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@investmentpartners.com"
                />
                {errors.advisorEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.advisorEmail.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  {...register('advisorPhone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+61 2 1234 5678"
                />
                {errors.advisorPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.advisorPhone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  {...register('advisorWebsiteUrl')}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://investmentpartners.com"
                />
              </div>
            </div>

            {/* Advisor Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  {...register('advisorStreet')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Collins Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suburb
                </label>
                <input
                  {...register('advisorSuburb')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Melbourne"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  {...register('advisorState')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select state</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode
                </label>
                <input
                  {...register('advisorPostcode')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  {...register('advisorCountry')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Australia"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialties
              </label>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Real Estate', 'Energy', 'Retail', 'Other'].map((specialty) => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => handleAdvisorSpecialtyToggle(specialty)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      advisorSpecialties.includes(specialty)
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Company Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-blue-600" />
            Company Details
          </h2>

          {/* Company Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your company name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Company Logo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Logo
            </label>
            <ImprovedPhotoUploadManager
              onPhotosChange={(photos) => {
                if (photos.length > 0) {
                  setCompanyLogo(photos[0].file)
                } else {
                  setCompanyLogo(null)
                }
              }}
              maxPhotos={1}
              aspectRatio={1}
              minDimensions={{ width: 200, height: 200 }}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload a square logo for best results. Minimum size: 200×200px. Click to crop and adjust.
            </p>
          </div>

          {/* Company Photos Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Photos
            </label>
            <ImprovedPhotoUploadManager
              onPhotosChange={setCompanyPhotos}
              maxPhotos={20}
              aspectRatio={4/3}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload up to 20 photos of your company, facilities, or team. Minimum size: 400×300px.
            </p>
          </div>


          {/* Sector, Industry, Sub-Industry */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sector *
              </label>
              <select
                {...register('sector')}
                value={selectedSector}
                onChange={(e) => {
                  setSelectedSector(e.target.value)
                  setSelectedIndustry('')
                  setValue('sector', e.target.value)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a sector</option>
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
              {errors.sector && (
                <p className="mt-1 text-sm text-red-600">{errors.sector.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry {selectedSector !== 'Other' ? '*' : ''}
              </label>
              <select
                {...register('industry')}
                value={selectedIndustry}
                onChange={(e) => {
                  setSelectedIndustry(e.target.value)
                  setValue('industry', e.target.value)
                }}
                disabled={!selectedSector}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select an industry</option>
                {selectedSector && industries[selectedSector as keyof typeof industries]?.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-Industry
              </label>
              <select
                {...register('subIndustry')}
                disabled={!selectedIndustry}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select a sub-industry</option>
                {selectedIndustry && subIndustries[selectedIndustry as keyof typeof subIndustries]?.map((subIndustry) => (
                  <option key={subIndustry} value={subIndustry}>
                    {subIndustry}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your company, its mission, and what makes it unique..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Equity Raising Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Seeking
              </label>
              <select
                {...register('amountSeeking')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select amount range</option>
                {amountRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Raising
              </label>
              <select
                {...register('raisingReason')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select reason</option>
                {raisingReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Photos Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Photos
            </label>
            <ImprovedPhotoUploadManager
              onPhotosChange={setProjectPhotos}
              maxPhotos={15}
              aspectRatio={4/3}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload photos related to your project, expansion plans, or what you plan to acquire. Minimum size: 400×300px.
            </p>
          </div>

          {/* Capital Raising Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What is the capital being raised for? *
            </label>
            <textarea
              {...register('raisingReason')}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the nature of your project, your plans, what you want to do or acquire with the capital. Be specific about how the funds will be used and what outcomes you expect to achieve."
            />
            {errors.raisingReason && (
              <p className="mt-1 text-sm text-red-600">{errors.raisingReason.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Provide a detailed description of your project, expansion plans, acquisitions, or other uses for the capital. This helps investors understand your vision and goals.
            </p>
          </div>

          {/* Properties/Assets */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Properties & Assets
            </label>
            <textarea
              {...register('properties')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your company's properties, assets, and physical locations..."
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                {...register('websiteUrl')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="contact@example.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="+61 2 1234 5678"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                {...register('street')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suburb
              </label>
              <input
                {...register('suburb')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Sydney"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                {...register('state')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select state</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postcode
              </label>
              <input
                {...register('postcode')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="2000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                {...register('country')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Australia"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {commonTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Listing'}
          </button>
        </div>
      </form>
    </div>
  )
}
