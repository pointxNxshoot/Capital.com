'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, X, Image as ImageIcon, Move, RotateCcw, Eye, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

interface Photo {
  id: string
  file: File
  preview: string
  croppedData?: string
  order: number
  thumbnail?: string
  display?: string
  highRes?: string
}

interface PhotoUploadManagerProps {
  onPhotosChange: (photos: Photo[]) => void
  maxPhotos?: number
  aspectRatio?: number
  className?: string
}

// Target resolutions for different use cases
const TARGET_RESOLUTIONS = {
  THUMBNAIL: 300,      // For grid display
  PREVIEW: 600,        // For crop modal
  DISPLAY: 1200,       // For final display
  HIGH_RES: 2400       // For high-quality viewing
}

export default function PhotoUploadManager({ 
  onPhotosChange, 
  maxPhotos = 20,
  aspectRatio = 1,
  className = ""
}: PhotoUploadManagerProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [cropModal, setCropModal] = useState<{ photo: Photo; index: number } | null>(null)

  // Notify parent component when photos change
  useEffect(() => {
    onPhotosChange(photos)
  }, [photos, onPhotosChange])
  const [cropData, setCropData] = useState({ x: 0, y: 0, width: 100, height: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1.2)
  const [imageLoaded, setImageLoaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Function to get the best resolution for a given container size
  const getBestResolution = (photo: Photo, containerWidth: number): string => {
    if (containerWidth <= 300) return photo.thumbnail || photo.preview
    if (containerWidth <= 600) return photo.preview || photo.display || photo.highRes
    if (containerWidth <= 1200) return photo.display || photo.highRes || photo.preview
    return photo.highRes || photo.display || photo.preview
  }

  // Function to create different resolution versions of an image
  const createImageVersions = async (file: File): Promise<{
    thumbnail: string
    preview: string
    display: string
    highRes: string
  }> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        // Calculate the best crop area to maintain aspect ratio
        const sourceAspect = img.width / img.height
        const targetAspect = aspectRatio
        
        let sourceX = 0
        let sourceY = 0
        let sourceWidth = img.width
        let sourceHeight = img.height

        if (sourceAspect > targetAspect) {
          // Source is wider than target - crop width
          sourceWidth = img.height * targetAspect
          sourceX = (img.width - sourceWidth) / 2
        } else if (sourceAspect < targetAspect) {
          // Source is taller than target - crop height
          sourceHeight = img.width / targetAspect
          sourceY = (img.height - sourceHeight) / 2
        }

        const versions: any = {}

        // Create thumbnail (300px) - properly cropped and scaled
        canvas.width = TARGET_RESOLUTIONS.THUMBNAIL
        canvas.height = TARGET_RESOLUTIONS.THUMBNAIL / aspectRatio
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, canvas.width, canvas.height
        )
        versions.thumbnail = canvas.toDataURL('image/jpeg', 0.85)

        // Create preview (600px) - properly cropped and scaled
        canvas.width = TARGET_RESOLUTIONS.PREVIEW
        canvas.height = TARGET_RESOLUTIONS.PREVIEW / aspectRatio
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, canvas.width, canvas.height
        )
        versions.preview = canvas.toDataURL('image/jpeg', 0.9)

        // Create display version (1200px) - properly cropped and scaled
        canvas.width = TARGET_RESOLUTIONS.DISPLAY
        canvas.height = TARGET_RESOLUTIONS.DISPLAY / aspectRatio
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, canvas.width, canvas.height
        )
        versions.display = canvas.toDataURL('image/jpeg', 0.95)

        // Create high-res version (2400px) - properly cropped and scaled
        canvas.width = TARGET_RESOLUTIONS.HIGH_RES
        canvas.height = TARGET_RESOLUTIONS.HIGH_RES / aspectRatio
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, canvas.width, canvas.height
        )
        versions.highRes = canvas.toDataURL('image/jpeg', 1.0)

        resolve(versions)
      }
      img.onerror = () => reject(new Error('Could not load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileSelect = async (files: FileList) => {
    const newFiles = Array.from(files).slice(0, maxPhotos - photos.length)
    
    for (const file of newFiles) {
      if (file && file.type.startsWith('image/')) {
        try {
          // Create different resolution versions
          const versions = await createImageVersions(file)
          
          const newPhoto: Photo = {
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: versions.preview, // Use preview for grid display
            thumbnail: versions.thumbnail,
            display: versions.display,
            highRes: versions.highRes,
            order: photos.length + 1
          }
          
          setPhotos(prev => {
            const updated = [...prev, newPhoto]
            return updated
          })
        } catch (error) {
          console.error('Error processing image:', error)
          // Fallback to simple preview
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            const newPhoto: Photo = {
              id: Math.random().toString(36).substr(2, 9),
              file,
              preview: result,
              order: photos.length + 1
            }
            
            setPhotos(prev => {
              const updated = [...prev, newPhoto]
              return updated
            })
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const removePhoto = (photoId: string) => {
    setPhotos(prev => {
      const updated = prev.filter(p => p.id !== photoId)
        .map((p, index) => ({ ...p, order: index + 1 }))
      return updated
    })
  }

  const movePhoto = (photoId: string, direction: 'up' | 'down') => {
    setPhotos(prev => {
      const currentIndex = prev.findIndex(p => p.id === photoId)
      if (currentIndex === -1) return prev
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev
      
      const updated = [...prev]
      const [movedPhoto] = updated.splice(currentIndex, 1)
      updated.splice(newIndex, 0, movedPhoto)
      
      // Update order numbers
      const reordered = updated.map((p, index) => ({ ...p, order: index + 1 }))
      return reordered
    })
  }

  const openCropModal = (photo: Photo, index: number) => {
    console.log('Opening crop modal for photo:', photo)
    console.log('Photo preview URL:', photo.preview)
    setCropModal({ photo, index })
    setCropData({ x: 0, y: 0, width: 100, height: 100 })
    setScale(1.2)
    setLastPosition({ x: 0, y: 0 })
    setImageLoaded(false)
  }

  const handleCropStart = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = e.currentTarget.getBoundingClientRect()
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleCropMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top
    
    const deltaX = currentX - dragStart.x
    const deltaY = currentY - dragStart.y
    
    setCropData(prev => ({
      ...prev,
      x: lastPosition.x + deltaX,
      y: lastPosition.y + deltaY
    }))
  }

  const handleCropEnd = () => {
    setIsDragging(false)
    setLastPosition({ x: cropData.x, y: cropData.y })
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale(prev => Math.max(0.3, Math.min(4, prev * delta)))
  }

  const applyCrop = async () => {
    if (!cropModal || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = async () => {
      try {
        // Create cropped versions at different resolutions
        const croppedVersions: any = {}
        
        // Crop at each target resolution
        for (const [versionName, targetSize] of Object.entries(TARGET_RESOLUTIONS)) {
          canvas.width = targetSize
          canvas.height = targetSize / aspectRatio

          // Calculate image dimensions and position for this resolution
          const imgAspectRatio = img.width / img.height
          const cropAspectRatio = aspectRatio
          
          let imgWidth, imgHeight, imgX, imgY
          
          if (imgAspectRatio > cropAspectRatio) {
            imgHeight = targetSize / aspectRatio
            imgWidth = imgHeight * imgAspectRatio
            imgX = (targetSize - imgWidth) / 2
            imgY = 0
          } else {
            imgWidth = targetSize
            imgHeight = targetSize / imgAspectRatio
            imgX = 0
            imgY = (targetSize / aspectRatio - imgHeight) / 2
          }

          // Apply scale and position
          const scaledWidth = imgWidth * scale
          const scaledHeight = imgHeight * scale
          const scaledX = imgX + (imgWidth - scaledWidth) / 2 + cropData.x
          const scaledY = imgY + (imgHeight - scaledHeight) / 2 + cropData.y

          // Enable high-quality image smoothing
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'

          // Draw scaled and positioned image
          ctx.drawImage(
            img,
            scaledX, scaledY, scaledWidth, scaledHeight,
            0, 0, targetSize, targetSize / aspectRatio
          )

          // Convert to data URL
          const quality = versionName === 'HIGH_RES' ? 1.0 : 
                         versionName === 'DISPLAY' ? 0.95 : 
                         versionName === 'PREVIEW' ? 0.9 : 0.8
          
          croppedVersions[versionName.toLowerCase()] = canvas.toDataURL('image/jpeg', quality)
        }

        // Create new cropped file (use display resolution as the main file)
        canvas.width = TARGET_RESOLUTIONS.DISPLAY
        canvas.height = TARGET_RESOLUTIONS.DISPLAY / aspectRatio
        
        // Re-draw for the main file
        const imgAspectRatio = img.width / img.height
        const cropAspectRatio = aspectRatio
        
        let imgWidth, imgHeight, imgX, imgY
        
        if (imgAspectRatio > cropAspectRatio) {
          imgHeight = TARGET_RESOLUTIONS.DISPLAY / aspectRatio
          imgWidth = imgHeight * imgAspectRatio
          imgX = (TARGET_RESOLUTIONS.DISPLAY - imgWidth) / 2
          imgY = 0
        } else {
          imgWidth = TARGET_RESOLUTIONS.DISPLAY
          imgHeight = TARGET_RESOLUTIONS.DISPLAY / imgAspectRatio
          imgX = 0
          imgY = (TARGET_RESOLUTIONS.DISPLAY / aspectRatio - imgHeight) / 2
        }

        const scaledWidth = imgWidth * scale
        const scaledHeight = imgHeight * scale
        const scaledX = imgX + (imgWidth - scaledWidth) / 2 + cropData.x
        const scaledY = imgY + (imgHeight - scaledHeight) / 2 + cropData.y

        ctx.drawImage(
          img,
          scaledX, scaledY, scaledWidth, scaledHeight,
          0, 0, TARGET_RESOLUTIONS.DISPLAY, TARGET_RESOLUTIONS.DISPLAY / aspectRatio
        )

        // Convert to blob for the main file
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], `cropped-${cropModal.photo.file.name}`, { type: 'image/jpeg' })
            
            setPhotos(prev => {
              const updated = prev.map(p => 
                p.id === cropModal.photo.id 
                  ? { 
                      ...p, 
                      file: croppedFile, 
                      preview: croppedVersions.preview,
                      thumbnail: croppedVersions.thumbnail,
                      display: croppedVersions.display,
                      highRes: croppedVersions.high_res,
                      croppedData: croppedVersions.preview
                    }
                  : p
              )
              return updated
            })
            
            setCropModal(null)
          }
        }, 'image/jpeg', 0.95)
      } catch (error) {
        console.error('Error applying crop:', error)
      }
    }
    img.src = cropModal.photo.preview
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${photos.length >= maxPhotos ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={photos.length < maxPhotos ? handleClick : undefined}
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
            <ImageIcon className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 mb-1">
            {photos.length >= maxPhotos 
              ? `Maximum ${maxPhotos} photos reached`
              : `Upload photos (${photos.length}/${maxPhotos})`
            }
          </p>
          <p className="text-xs text-gray-400">
            {photos.length < maxPhotos ? 'Click to upload or drag and drop' : 'Remove photos to upload more'}
          </p>
        </div>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={photo.id} className="relative group">
              <div 
                className={`rounded-lg overflow-hidden bg-gray-100 cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all duration-200 ${
                  aspectRatio === 1 ? 'aspect-square' : 'aspect-video'
                }`}
                onClick={() => openCropModal(photo, index)}
              >
                <img
                  src={getBestResolution(photo, 300)}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Click indicator */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-white bg-opacity-90 rounded-full p-2">
                      <Move className="h-4 w-4 text-gray-700" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openCropModal(photo, index)
                    }}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                    title="Crop photo"
                  >
                    <Move className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removePhoto(photo.id)
                    }}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    title="Remove photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Order Number */}
              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {photo.order}
              </div>
              
              {/* Move Buttons */}
              <div className="absolute top-2 right-2 flex flex-col space-y-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    movePhoto(photo.id, 'up')
                  }}
                  disabled={index === 0}
                  className="p-1 bg-white rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    movePhoto(photo.id, 'down')
                  }}
                  disabled={index === photos.length - 1}
                  className="p-1 bg-white rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crop Modal */}
      {cropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Move className="h-5 w-5 mr-2" />
                Crop Photo
              </h3>
              <button
                onClick={() => setCropModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <div 
                className="relative border-2 border-gray-300 rounded-lg overflow-hidden mx-auto bg-gray-100"
                style={{ 
                  width: 600, 
                  height: 600 / aspectRatio,
                  aspectRatio: aspectRatio
                }}
                onMouseDown={handleCropStart}
                onMouseMove={handleCropMove}
                onMouseUp={handleCropEnd}
                onMouseLeave={handleCropEnd}
                onWheel={handleWheel}
              >
                {/* Loading state */}
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-gray-500">Loading image...</div>
                  </div>
                )}
                <img
                  src={cropModal.photo.highRes || cropModal.photo.preview}
                  alt="Crop preview"
                  className={`absolute inset-0 select-none ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transform: `scale(${scale}) translate(${cropData.x / scale}px, ${cropData.y / scale}px)`,
                    transformOrigin: 'center center',
                    transition: 'opacity 0.2s ease-in-out'
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully')
                    setImageLoaded(true)
                    // Reset position when image loads
                    setCropData({ x: 0, y: 0, width: 100, height: 100 })
                    setScale(1.2)
                    setLastPosition({ x: 0, y: 0 })
                  }}
                  onError={(e) => {
                    console.error('Failed to load image for cropping:', e)
                    setImageLoaded(false)
                  }}
                />
                
                {/* Crop overlay with see-through area */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* See-through crop area with dark overlay around it */}
                  <div 
                    className="absolute border-2 border-white bg-transparent"
                    style={{
                      left: '50%',
                      top: '50%',
                      width: '100%',
                      height: '100%',
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                    }}
                  >
                    {/* Corner handles */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-2 border-white bg-white rounded-full"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-2 border-white bg-white rounded-full"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-2 border-white bg-white rounded-full"></div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center mt-4 space-x-4">
                <button
                  onClick={() => {
                    setScale(1.2)
                    setCropData({ x: 0, y: 0, width: 100, height: 100 })
                    setLastPosition({ x: 0, y: 0 })
                  }}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Zoom:</span>
                  <input
                    type="range"
                    min="0.3"
                    max="4"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600">{Math.round(scale * 100)}%</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-2 text-center">
                Drag to move • Scroll to zoom • The white area shows what will be visible
              </p>
              
              {/* Debug info */}
              <div className="mt-2 text-xs text-gray-500 text-center">
                <p>Image URL: {cropModal.photo.preview.substring(0, 50)}...</p>
                <p>Loaded: {imageLoaded ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCropModal(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
