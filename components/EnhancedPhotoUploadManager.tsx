'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle, Loader2, Crop } from 'lucide-react'
import ImageCropModal from './ImageCropModal'

interface Photo {
  id: string
  url: string
  file?: File
  order: number
  error?: string
  uploading?: boolean
  originalUrl?: string // Store original URL for re-cropping
}

interface EnhancedPhotoUploadManagerProps {
  onPhotosChange: (photos: Photo[]) => void
  maxPhotos?: number
  className?: string
  initialPhotos?: Photo[]
  aspectRatio?: number
  outputWidth?: number
  outputHeight?: number
}

export default function EnhancedPhotoUploadManager({ 
  onPhotosChange, 
  maxPhotos = 20,
  className = "",
  initialPhotos = [],
  aspectRatio = 4/3,
  outputWidth = 1200,
  outputHeight = 900
}: EnhancedPhotoUploadManagerProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [cropModal, setCropModal] = useState<{ isOpen: boolean; photoId: string; imageUrl: string }>({
    isOpen: false,
    photoId: '',
    imageUrl: ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hasInitialized = useRef(false)

  // Only sync with initialPhotos on mount, not on every change
  useEffect(() => {
    if (!hasInitialized.current) {
      setPhotos(initialPhotos)
      hasInitialized.current = true
    }
  }, [initialPhotos])

  // Notify parent component when photos change
  useEffect(() => {
    onPhotosChange(photos)
  }, [photos, onPhotosChange])

  const uploadFile = async (file: File): Promise<{ url?: string; error?: string }> => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        return { error: result.error || 'Upload failed' }
      }

      return { url: result.url }
    } catch (error) {
      console.error('Upload error:', error)
      return { error: 'Network error. Please try again.' }
    }
  }

  const handleFileSelect = async (files: FileList) => {
    const newFiles = Array.from(files).slice(0, maxPhotos - photos.length)
    
    if (newFiles.length === 0) {
      setUploadError('Maximum number of photos reached')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    for (const file of newFiles) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        const errorPhoto: Photo = {
          id: `error-${Date.now()}-${Math.random()}`,
          url: '',
          file,
          order: photos.length,
          error: 'Invalid file type. Please select an image file.'
        }
        setPhotos(prev => [...prev, errorPhoto])
        continue
      }

      // Validate file size (15MB)
      if (file.size > 15 * 1024 * 1024) {
        const errorPhoto: Photo = {
          id: `error-${Date.now()}-${Math.random()}`,
          url: '',
          file,
          order: photos.length,
          error: 'File too large. Maximum size is 15MB.'
        }
        setPhotos(prev => [...prev, errorPhoto])
        continue
      }

      // Create uploading photo placeholder
      const uploadingPhoto: Photo = {
        id: `uploading-${Date.now()}-${Math.random()}`,
        url: '',
        file,
        order: photos.length,
        uploading: true
      }
      
      setPhotos(prev => [...prev, uploadingPhoto])

      // Upload the file
      const result = await uploadFile(file)
      
      if (result.error) {
        // Update the uploading photo with error
        setPhotos(prev => prev.map(photo => 
          photo.id === uploadingPhoto.id 
            ? { ...photo, uploading: false, error: result.error }
            : photo
        ))
      } else {
        // Update the uploading photo with success
        setPhotos(prev => prev.map(photo => 
          photo.id === uploadingPhoto.id 
            ? { 
                ...photo, 
                uploading: false, 
                url: result.url!,
                originalUrl: result.url! // Store original for re-cropping
              }
            : photo
        ))
      }
    }

    setIsUploading(false)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }, [])

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const newPhotos = prev.filter(photo => photo.id !== id)
      // Reorder remaining photos
      return newPhotos.map((photo, index) => ({
        ...photo,
        order: index
      }))
    })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files)
    }
    // Reset input value so same file can be selected again
    e.target.value = ''
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const openCropModal = (photoId: string, imageUrl: string) => {
    setCropModal({
      isOpen: true,
      photoId,
      imageUrl
    })
  }

  const closeCropModal = () => {
    setCropModal({
      isOpen: false,
      photoId: '',
      imageUrl: ''
    })
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      // Upload the cropped image
      const formData = new FormData()
      formData.append('file', croppedBlob, 'cropped-image.jpg')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        // Update the photo with the cropped URL
        setPhotos(prev => prev.map(photo => 
          photo.id === cropModal.photoId 
            ? { ...photo, url: result.url }
            : photo
        ))
      } else {
        console.error('Error uploading cropped image:', result.error)
      }
    } catch (error) {
      console.error('Error processing cropped image:', error)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Upload className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-900">
            {isUploading ? 'Uploading images...' : 'Upload photos'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Drag and drop images here, or click to select
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Maximum {maxPhotos} photos, 15MB each
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Uploading images...</span>
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                {photo.uploading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Uploading...</p>
                    </div>
                  </div>
                ) : photo.error ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-2">
                      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <p className="text-xs text-red-600">{photo.error}</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={photo.url}
                    alt={`Photo ${photo.order + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  {!photo.uploading && !photo.error && (
                    <button
                      type="button"
                      onClick={() => openCropModal(photo.id, photo.originalUrl || photo.url)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      title="Crop image"
                    >
                      <Crop className="h-4 w-4 text-gray-700" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crop Modal */}
      <ImageCropModal
        isOpen={cropModal.isOpen}
        onClose={closeCropModal}
        imageUrl={cropModal.imageUrl}
        onCropComplete={handleCropComplete}
        aspectRatio={aspectRatio}
        outputWidth={outputWidth}
        outputHeight={outputHeight}
      />
    </div>
  )
}
