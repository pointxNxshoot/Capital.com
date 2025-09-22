'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { listingFormSchema, type ListingFormInput } from '@/lib/validators'
import { Building2, Upload, X, User, MapPin, DollarSign, FileText } from 'lucide-react'
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

const tags = [
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

const advisorSpecialties = [
  'M&A',
  'Growth Capital',
  'Private Equity',
  'Venture Capital',
  'Debt Financing',
  'IPO Preparation',
  'Strategic Planning',
  'Financial Modeling',
  'Due Diligence',
  'Exit Planning'
]

interface EditListingFormProps {
  initialData: any
  onSave: (data: any) => void
  saving: boolean
}

export default function EditListingForm({ 
  initialData, 
  onSave, 
  saving = false
}: EditListingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasAdvisor, setHasAdvisor] = useState<boolean | null>(null)
  const [selectedSector, setSelectedSector] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [advisorSpecialties, setAdvisorSpecialties] = useState<string[]>([])
  const [companyLogo, setCompanyLogo] = useState<any[]>([])
  const [advisorHeadshot, setAdvisorHeadshot] = useState<any[]>([])
  const [companyPhotos, setCompanyPhotos] = useState<any[]>([])
  const [projectPhotos, setProjectPhotos] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ListingFormInput>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      country: 'Australia',
      advisorCountry: 'Australia',
      tags: [],
      photos: [],
      projectPhotos: [],
      specialties: []
    }
  })

  // Initialize form with initialData
  useEffect(() => {
    if (initialData) {
      // Set form values
      Object.keys(initialData).forEach(key => {
        if (key in initialData) {
          setValue(key as keyof ListingFormInput, initialData[key])
        }
      })
      
      // Set state values
      if (initialData.sector) setSelectedSector(initialData.sector)
      if (initialData.industry) setSelectedIndustry(initialData.industry)
      if (initialData.tags) setSelectedTags(initialData.tags)
      if (initialData.specialties) setAdvisorSpecialties(initialData.specialties)
      if (initialData.advisorId) setHasAdvisor(true)
      
      // Convert photos to the expected format
      if (initialData.photos && initialData.photos.length > 0) {
        const photoObjects = initialData.photos.map((url: string, index: number) => ({
          id: `photo-${index}`,
          file: null,
          preview: url,
          processed: {
            thumbnail: url,
            card: url,
            hero: url,
            display: url,
            fullscreen: url,
            original: url
          }
        }))
        setCompanyPhotos(photoObjects)
      }
      
      if (initialData.projectPhotos && initialData.projectPhotos.length > 0) {
        const projectPhotoObjects = initialData.projectPhotos.map((url: string, index: number) => ({
          id: `project-photo-${index}`,
          file: null,
          preview: url,
          processed: {
            thumbnail: url,
            card: url,
            hero: url,
            display: url,
            fullscreen: url,
            original: url
          }
        }))
        setProjectPhotos(projectPhotoObjects)
      }

      // Handle logo
      if (initialData.logoUrl) {
        setCompanyLogo([{
          id: 'logo-0',
          file: null,
          preview: initialData.logoUrl,
          processed: {
            thumbnail: initialData.logoUrl,
            card: initialData.logoUrl,
            hero: initialData.logoUrl,
            display: initialData.logoUrl,
            fullscreen: initialData.logoUrl,
            original: initialData.logoUrl
          }
        }])
      }
    }
  }, [initialData, setValue])

  // Reset isSubmitting when saving completes
  useEffect(() => {
    if (!saving && isSubmitting) {
      setIsSubmitting(false)
    }
  }, [saving, isSubmitting])

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
      console.log('Form data:', data)
      console.log('Company logo:', companyLogo)
      console.log('Advisor headshot:', advisorHeadshot)
      console.log('Company photos:', companyPhotos)
      console.log('Project photos:', projectPhotos)

      // Convert uploaded images to base64 for now (in production, upload to cloud storage)
      let logoUrl = data.logoUrl || ''
      if (companyLogo.length > 0) {
        logoUrl = companyLogo[0].processed.card
      }

      let headshotUrl = data.headshotUrl || ''
      if (advisorHeadshot.length > 0) {
        headshotUrl = advisorHeadshot[0].processed.card
      }

      // Convert company photos to base64 using the card preset
      const companyPhotosUrls = companyPhotos.map(photo => photo.processed.card)
      
      // Convert project photos to base64 using the card preset
      const projectPhotosUrls = projectPhotos.map(photo => photo.processed.card)

      // Handle advisor creation/update if they have one
      let advisorId = initialData.advisorId || null
      if (hasAdvisor && data.firmName) {
        // If we already have an advisor ID, we might want to update the advisor
        // For now, we'll keep the existing advisor ID or create a new one
        if (!advisorId) {
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
      }

      // Prepare the company data for update
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
        createdBy: initialData.createdBy // Keep the original createdBy
      }

      console.log('Submitting company data:', companyData)

      // Call the onSave callback with the prepared data
      onSave(companyData)
    } catch (error) {
      console.error('Error preparing listing data:', error)
      alert('Failed to prepare listing data. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Your Company Listing</h1>
        <p className="text-gray-600">Update your company details and photos</p>
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
        {hasAdvisor && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Advisor Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Firm Name *
                </label>
                <input
                  {...register('firmName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Deloitte, KPMG"
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
                  placeholder="e.g., John Smith"
                />
                {errors.teamLead && (
                  <p className="mt-1 text-sm text-red-600">{errors.teamLead.message}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headshot
              </label>
              <ImprovedPhotoUploadManager
                onPhotosChange={setAdvisorHeadshot}
                maxPhotos={1}
                aspectRatio={0.8}
                minDimensions={{ width: 200, height: 160 }}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a professional headshot. Minimum size: 200×160px. Click to crop and focus on the face.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('advisorEmail')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="advisor@firm.com"
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
                  type="tel"
                  {...register('advisorPhone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+61 2 1234 5678"
                />
                {errors.advisorPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.advisorPhone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  {...register('advisorStreet')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suburb
                </label>
                <input
                  {...register('advisorSuburb')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Sydney"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode
                </label>
                <input
                  {...register('advisorPostcode')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2000"
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

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                {...register('advisorWebsiteUrl')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://firm.com"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('advisorDescription')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the advisor's expertise and experience..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialties
              </label>
              <div className="flex flex-wrap gap-2">
                {advisorSpecialties.map((specialty) => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => handleAdvisorSpecialtyToggle(specialty)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      advisorSpecialties.includes(specialty)
                        ? 'bg-blue-600 text-white'
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

          {/* Basic Info */}
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

          {/* Company Logo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Logo
            </label>
            <ImprovedPhotoUploadManager
              onPhotosChange={setCompanyLogo}
              maxPhotos={1}
              aspectRatio={1}
              minDimensions={{ width: 200, height: 200 }}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload a square logo for best results. Minimum size: 200×200px. Click to crop and adjust.
            </p>
          </div>

          {/* Company Photos */}
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

          {/* Sector and Industry */}
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
          </div>

          {/* Amount Seeking and Reason */}
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
            <p className="text-xs text-gray-500 mt-1">
              Provide a detailed description of your project, expansion plans, acquisitions, or other uses for the capital. This helps investors understand your vision and goals.
            </p>
          </div>

          {/* Properties */}
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
                type="url"
                {...register('websiteUrl')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
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
              type="tel"
              {...register('phone')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="+61 2 1234 5678"
            />
          </div>

          {/* Address */}
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
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
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
            disabled={isSubmitting || saving}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting || saving ? 'Updating...' : 'Update Listing'}
          </button>
        </div>
      </form>
    </div>
  )
}
