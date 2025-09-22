'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companySchema, type CompanyInput } from '@/lib/validators'
import { Building2, Upload, X, User, MapPin, DollarSign, FileText } from 'lucide-react'

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

export default function SimpleListingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hasAdvisor, setHasAdvisor] = useState<boolean | null>(null)
  const [selectedSector, setSelectedSector] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      country: 'Australia',
      tags: [],
      photos: [],
      projectPhotos: []
    }
  })

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    setSelectedTags(newTags)
    setValue('tags', newTags)
  }

  const onSubmit = async (data: CompanyInput) => {
    setIsSubmitting(true)
    
    try {
      // Prepare the data for submission
      const companyData = {
        ...data,
        industry: data.industry || (data.sector === 'Other' ? 'Other' : ''),
        tags: selectedTags,
        photos: [],
        projectPhotos: []
      }

      console.log('Submitting company data:', companyData)

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
        setHasAdvisor(null)
        setSelectedSector('')
        setSelectedIndustry('')
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
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
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">Listing Submitted Successfully!</h3>
        <p className="text-green-700 mb-4">
          Your company listing has been submitted and is pending review. We'll notify you once it's published.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
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
        <p className="text-gray-600">Submit your company for equity investment opportunities</p>
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
