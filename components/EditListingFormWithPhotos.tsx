'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Building2 } from 'lucide-react'
import ImprovedPhotoUploadManager from './ImprovedPhotoUploadManager'

// Form validation schema
const editFormSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  sector: z.string().min(1, 'Sector is required'),
  industry: z.string().min(1, 'Industry is required'),
  subIndustry: z.string().optional(),
  description: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  street: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  amountSeeking: z.string().optional(),
  raisingReason: z.string().optional(),
  properties: z.string().optional(),
})

type EditFormData = z.infer<typeof editFormSchema>

interface Photo {
  id: string
  file: File | null
  processed: {
    thumbnail: string
    card: string
    hero: string
    display: string
    fullscreen: string
    original: string
  }
}

interface EditListingFormWithPhotosProps {
  initialData: any
  onSave: (data: any) => void
  saving: boolean
}

export default function EditListingFormWithPhotos({ initialData, onSave, saving }: EditListingFormWithPhotosProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditFormData>({
    resolver: zodResolver(editFormSchema),
    defaultValues: initialData
  })

  // Photo state management
  const [companyLogo, setCompanyLogo] = useState<Photo[]>([])
  const [companyPhotos, setCompanyPhotos] = useState<Photo[]>([])
  const [projectPhotos, setProjectPhotos] = useState<Photo[]>([])

  // Convert initial photos to the expected format
  useEffect(() => {
    if (initialData) {
      reset(initialData)
      
      // Convert logo
      if (initialData.logoUrl) {
        setCompanyLogo([{
          id: 'logo-1',
          file: null,
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

      // Convert company photos
      if (initialData.photos && initialData.photos.length > 0) {
        const photoObjects = initialData.photos.map((url: string, index: number) => ({
          id: `photo-${index}`,
          file: null,
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

      // Convert project photos
      if (initialData.projectPhotos && initialData.projectPhotos.length > 0) {
        const photoObjects = initialData.projectPhotos.map((url: string, index: number) => ({
          id: `project-${index}`,
          file: null,
          processed: {
            thumbnail: url,
            card: url,
            hero: url,
            display: url,
            fullscreen: url,
            original: url
          }
        }))
        setProjectPhotos(photoObjects)
      }
    }
  }, [initialData, reset])


  const onSubmit = (data: EditFormData) => {
    // Process photos for submission
    const logoUrl = companyLogo.length > 0 ? companyLogo[0].processed.card : initialData.logoUrl || ''
    const photos = companyPhotos.map(photo => photo.processed.card)
    const projectPhotosData = projectPhotos.map(photo => photo.processed.card)

    const formData = {
      ...data,
      logoUrl,
      photos,
      projectPhotos: projectPhotosData
    }

    onSave(formData)
  }

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
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
              initialPhotos={companyLogo}
              instanceId="edit-logo"
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
              initialPhotos={companyPhotos}
              instanceId="edit-company-photos"
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.sector ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a sector</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Education">Education</option>
                <option value="Energy">Energy</option>
                <option value="Transportation">Transportation</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Other">Other</option>
              </select>
              {errors.sector && (
                <p className="mt-1 text-sm text-red-600">{errors.sector.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <input
                {...register('industry')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.industry ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter industry"
              />
              {errors.industry && (
                <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Industry
              </label>
              <input
                {...register('subIndustry')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter sub industry"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your company, its mission, and what makes it unique..."
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.websiteUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://example.com"
              />
              {errors.websiteUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.websiteUrl.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="contact@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suburb
              </label>
              <input
                {...register('suburb')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sydney"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                {...register('state')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select state</option>
                <option value="NSW">NSW</option>
                <option value="VIC">VIC</option>
                <option value="QLD">QLD</option>
                <option value="WA">WA</option>
                <option value="SA">SA</option>
                <option value="TAS">TAS</option>
                <option value="ACT">ACT</option>
                <option value="NT">NT</option>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                {...register('country')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Australia"
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>
          </div>

          {/* Funding Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Seeking
              </label>
              <select
                {...register('amountSeeking')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select amount</option>
                <option value="$0 - $100K">$0 - $100K</option>
                <option value="$100K - $500K">$100K - $500K</option>
                <option value="$500K - $1M">$500K - $1M</option>
                <option value="$1M - $5M">$1M - $5M</option>
                <option value="$5M - $10M">$5M - $10M</option>
                <option value="$10M - $25M">$10M - $25M</option>
                <option value="$25M+">$25M+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raising Reason
              </label>
              <select
                {...register('raisingReason')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select reason</option>
                <option value="Working Capital">Working Capital</option>
                <option value="Expansion">Expansion</option>
                <option value="R&D">R&D</option>
                <option value="Equipment">Equipment</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Properties/Assets
            </label>
            <textarea
              {...register('properties')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your company's properties, assets, and physical locations..."
            />
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
              initialPhotos={projectPhotos}
              instanceId="edit-project-photos"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload photos related to your project, expansion plans, or what you plan to acquire. Minimum size: 400×300px.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Link
            href="/my-listings"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => reset(initialData)}
            disabled={saving}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 rounded-md text-white font-medium ${
              saving 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saving ? 'Updating...' : 'Update Listing'}
          </button>
        </div>
      </form>
    </div>
  )
}
