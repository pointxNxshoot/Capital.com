'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, X, Image as ImageIcon, Move, RotateCcw, Eye, Trash2, ChevronUp, ChevronDown, AlertCircle, Crop } from 'lucide-react'
import { processImageToAllPresets, validateImageDimensions, ASPECT_RATIOS, type ProcessedImage } from '../lib/imageUtils'
import ImprovedCropModal from './ImprovedCropModal'

interface Photo {
  id: string
  file: File
  processed: ProcessedImage
  order: number
  error?: string
}

interface ImprovedPhotoUploadManagerProps {
  onPhotosChange: (photos: Photo[]) => void
  maxPhotos?: number
  aspectRatio?: number
  className?: string
  minDimensions?: { width: number; height: number }
  initialPhotos?: Photo[]
  instanceId?: string // Unique identifier to prevent state conflicts
}

export default function ImprovedPhotoUploadManager({ 
  onPhotosChange, 
  maxPhotos = 20,
  aspectRatio = ASPECT_RATIOS.CARD,
  className = "",
  minDimensions,
  initialPhotos = [],
  instanceId = 'default'
}: ImprovedPhotoUploadManagerProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cropPhoto, setCropPhoto] = useState<Photo | null>(null)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMounted, setIsMounted] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize photos with initialPhotos
  useEffect(() => {
    if (initialPhotos.length > 0 && photos.length === 0) {
      setPhotos(initialPhotos)
    }
    // Mark as initialized after first render
    if (!isInitialized) {
      setIsInitialized(true)
    }
  }, [initialPhotos, photos.length, isInitialized])

  // Notify parent component when photos change (but not during initialization)
  useEffect(() => {
    if (isInitialized && isMounted) {
      onPhotosChange(photos)
    }
  }, [photos, onPhotosChange, isInitialized, isMounted])

  // Cleanup effect to prevent state conflicts when component unmounts
  useEffect(() => {
    return () => {
      // Mark component as unmounted to prevent further state updates
      setIsMounted(false)
    }
  }, [])

  const handleFileSelect = async (files: FileList) => {
    const newFiles = Array.from(files).slice(0, maxPhotos - photos.length)
    setIsProcessing(true)
    
    for (const file of newFiles) {
      try {
        // Validate image dimensions
        const validation = await validateImageDimensions(file, minDimensions)
        if (!validation.valid) {
          const errorPhoto: Photo = {
            id: `error-${Date.now()}-${Math.random()}`,
            file,
            processed: {
              thumbnail: '',
              card: '',
              hero: '',
              display: '',
              fullscreen: '',
              original: ''
            },
            order: photos.length,
            error: validation.error
          }
          if (isMounted) {
            setPhotos(prev => [...prev, errorPhoto])
            setIsInitialized(true)
          }
          continue
        }

        // Process image to all presets for better quality and performance
        try {
          const processed = await processImageToAllPresets(file, minDimensions)
          
          const newPhoto: Photo = {
            id: `photo-${Date.now()}-${Math.random()}`,
            file,
            processed,
            order: photos.length
          }
          
          if (isMounted) {
            setPhotos(prev => [...prev, newPhoto])
            setIsInitialized(true)
          }
        } catch (error) {
          console.error('Error processing image:', error)
          // Fallback to simple preview
          const reader = new FileReader()
          reader.onload = (e) => {
            const originalUrl = e.target?.result as string
            const processed = {
              thumbnail: originalUrl,
              card: originalUrl,
              hero: originalUrl,
              display: originalUrl,
              fullscreen: originalUrl,
              original: originalUrl
            }
            
            const newPhoto: Photo = {
              id: `photo-${Date.now()}-${Math.random()}`,
              file,
              processed,
              order: photos.length
            }
            
            if (isMounted) {
              setPhotos(prev => [...prev, newPhoto])
              setIsInitialized(true)
            }
          }
          reader.readAsDataURL(file)
        }
      } catch (error) {
        console.error('Error processing image:', error)
        const errorPhoto: Photo = {
          id: `error-${Date.now()}-${Math.random()}`,
          file,
          processed: {
            thumbnail: '',
            card: '',
            hero: '',
            display: '',
            fullscreen: '',
            original: ''
          },
          order: photos.length,
          error: error instanceof Error ? error.message : 'Failed to process image'
        }
        if (isMounted) {
          setPhotos(prev => [...prev, errorPhoto])
          setIsInitialized(true)
        }
      }
    }
    
    if (isMounted) {
      setIsProcessing(false)
    }
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

  const movePhoto = (id: string, direction: 'up' | 'down') => {
    setPhotos(prev => {
      const newPhotos = [...prev]
      const currentIndex = newPhotos.findIndex(photo => photo.id === id)
      
      if (currentIndex === -1) return prev
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      
      if (newIndex < 0 || newIndex >= newPhotos.length) return prev
      
      // Swap photos
      const temp = newPhotos[currentIndex]
      newPhotos[currentIndex] = newPhotos[newIndex]
      newPhotos[newIndex] = temp
      
      // Update order
      return newPhotos.map((photo, index) => ({
        ...photo,
        order: index
      }))
    })
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const openCropModal = (photo: Photo) => {
    setCropPhoto(photo)
    setIsCropModalOpen(true)
  }

  const closeCropModal = () => {
    setCropPhoto(null)
    setIsCropModalOpen(false)
  }

  const applyCrop = (croppedDataUrl: string) => {
    if (!cropPhoto) return

    // Create new processed image with cropped version
    const processed = {
      thumbnail: croppedDataUrl,
      card: croppedDataUrl,
      hero: croppedDataUrl,
      display: croppedDataUrl,
      fullscreen: croppedDataUrl,
      original: croppedDataUrl
    }
    
    // Update the photo
    setPhotos(prev => prev.map(photo => 
      photo.id === cropPhoto.id 
        ? { ...photo, processed }
        : photo
    ))
    
    closeCropModal()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isProcessing ? 'Processing images...' : 'Upload photos'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop images here, or click to select
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Minimum size: {minDimensions ? `${minDimensions.width}×${minDimensions.height}px` : '400×300px'} • Max {maxPhotos} photos • JPG, PNG, WebP
            </p>
          </div>
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-sm">Processing images...</span>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos
            .sort((a, b) => a.order - b.order)
            .map((photo: Photo, index: number) => (
            <div
              key={photo.id}
              className={`relative group ${
                photo.error ? 'border-2 border-red-300' : 'border border-gray-200'
              } rounded-lg overflow-hidden`}
              style={{ aspectRatio: aspectRatio }}
            >
              {photo.error ? (
                // Error state
                <div className="w-full h-full bg-red-50 flex flex-col items-center justify-center p-4">
                  <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
                  <p className="text-xs text-red-600 text-center leading-tight">
                    {photo.error}
                  </p>
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="mt-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // Normal photo
                <>
                  <img
                    src={photo.processed.card}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'auto' }}
                    onError={(e) => {
                      console.error('Image failed to load:', photo.processed.card)
                      console.error('Photo data:', photo)
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', photo.processed.card)
                    }}
                  />
                  
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          movePhoto(photo.id, 'up')
                        }}
                        disabled={index === 0}
                        className="p-1 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          movePhoto(photo.id, 'down')
                        }}
                        disabled={index === photos.length - 1}
                        className="p-1 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          openCropModal(photo)
                        }}
                        className="p-1 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100"
                        title="Crop"
                      >
                        <Crop className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removePhoto(photo.id)
                        }}
                        className="p-1 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Order indicator */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {photos.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          {photos.length} of {maxPhotos} photos uploaded
          {photos.filter(p => p.error).length > 0 && (
            <span className="text-red-500 ml-2">
              ({photos.filter(p => p.error).length} failed)
            </span>
          )}
        </div>
      )}

      {/* Improved Crop Modal */}
      <ImprovedCropModal
        isOpen={isCropModalOpen}
        onClose={closeCropModal}
        imageSrc={cropPhoto?.processed.card || ''}
        aspectRatio={aspectRatio}
        onCrop={applyCrop}
      />
    </div>
  )
}
