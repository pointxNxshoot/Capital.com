'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react'

interface Photo {
  id: string
  url: string
  alt: string
  thumbnail?: string
  display?: string
  highRes?: string
}

interface RealEstatePhotoDisplayProps {
  photos: Photo[]
  className?: string
  maxHeight?: string
}

export default function RealEstatePhotoDisplay({ 
  photos, 
  className = "", 
  maxHeight = "500px"
}: RealEstatePhotoDisplayProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)

  // Get the best resolution for display
  const getBestPhotoUrl = (photo: Photo, containerWidth: number = 800): string => {
    if (containerWidth <= 200) return photo.thumbnail || photo.url
    if (containerWidth <= 600) return photo.display || photo.url
    return photo.highRes || photo.display || photo.url
  }

  // Handle zoom
  const handleZoom = (direction: 'in' | 'out') => {
    const zoomFactor = direction === 'in' ? 1.3 : 0.8
    setZoom(prev => Math.max(0.5, Math.min(5, prev * zoomFactor)))
  }

  // Handle rotation
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  // Handle drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Reset zoom and position when photo changes
  useEffect(() => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    setRotation(0)
  }, [selectedPhoto])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return
      
      switch (e.key) {
        case 'ArrowLeft':
          setSelectedPhoto(prev => prev > 0 ? prev - 1 : photos.length - 1)
          break
        case 'ArrowRight':
          setSelectedPhoto(prev => prev < photos.length - 1 ? prev + 1 : 0)
          break
        case 'Escape':
          setIsFullscreen(false)
          break
        case '+':
        case '=':
          handleZoom('in')
          break
        case '-':
          handleZoom('out')
          break
        case 'r':
        case 'R':
          handleRotate()
          break
        case '0':
          setZoom(1)
          setPosition({ x: 0, y: 0 })
          setRotation(0)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, photos.length])

  if (!photos || photos.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height: maxHeight }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No photos available</p>
        </div>
      </div>
    )
  }

  const currentPhoto = photos[selectedPhoto]


  return (
    <div className={`space-y-4 ${className}`}>
      {/* Photo Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`relative bg-gray-100 rounded-lg overflow-hidden group cursor-pointer ${
              index === 0 ? 'md:col-span-2 md:row-span-2' : ''
            }`}
            style={{ 
              height: index === 0 ? maxHeight : '200px',
              minHeight: '150px'
            }}
            onClick={() => {
              setSelectedPhoto(index)
              setIsFullscreen(true)
            }}
          >
            <img
              src={getBestPhotoUrl(photo, index === 0 ? 1200 : 400)}
              alt={photo.alt}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            
            {/* Overlay with controls */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  className="p-3 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors shadow-lg"
                  title="View fullscreen"
                >
                  <Maximize2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Photo counter for main photo */}
            {index === 0 && photos.length > 1 && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
                {photos.length} photos
              </div>
            )}

            {/* Additional photos indicator */}
            {index === 0 && photos.length > 6 && (
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
                +{photos.length - 6} more
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black bg-opacity-80 text-white">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-medium">
                Photo {selectedPhoto + 1} of {photos.length}
              </h3>
              <div className="text-sm text-gray-300">
                {currentPhoto.alt}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRotate}
                className="p-2 bg-white bg-opacity-20 rounded text-white hover:bg-opacity-30 transition-colors"
                title="Rotate (R)"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleZoom('out')}
                className="p-2 bg-white bg-opacity-20 rounded text-white hover:bg-opacity-30 transition-colors"
                title="Zoom out (-)"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleZoom('in')}
                className="p-2 bg-white bg-opacity-20 rounded text-white hover:bg-opacity-30 transition-colors"
                title="Zoom in (+)"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setZoom(1)
                  setPosition({ x: 0, y: 0 })
                  setRotation(0)
                }}
                className="p-2 bg-white bg-opacity-20 rounded text-white hover:bg-opacity-30 transition-colors"
                title="Reset (0)"
              >
                <span className="text-xs font-bold">0</span>
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 bg-white bg-opacity-20 rounded text-white hover:bg-opacity-30 transition-colors"
                title="Close (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Photo Display */}
          <div className="flex-1 flex items-center justify-center p-4 relative">
            <div
              className="relative max-w-full max-h-full overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <img
                src={getBestPhotoUrl(currentPhoto, 2000)}
                alt={currentPhoto.alt}
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                }}
              />
            </div>

            {/* Navigation arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedPhoto(selectedPhoto > 0 ? selectedPhoto - 1 : photos.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors"
                  title="Previous photo (←)"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setSelectedPhoto(selectedPhoto < photos.length - 1 ? selectedPhoto + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors"
                  title="Next photo (→)"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {photos.length > 1 && (
            <div className="flex justify-center space-x-2 p-4 bg-black bg-opacity-80 overflow-x-auto">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(index)}
                  className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all duration-200 ${
                    index === selectedPhoto ? 'border-white ring-2 ring-blue-400' : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={getBestPhotoUrl(photo, 64)}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 text-white text-xs bg-black bg-opacity-50 px-3 py-2 rounded">
            Use ← → to navigate, + - to zoom, R to rotate, 0 to reset, Esc to close
          </div>
        </div>
      )}
    </div>
  )
}
