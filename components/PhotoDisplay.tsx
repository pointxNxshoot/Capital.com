'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'

interface Photo {
  id: string
  url: string
  alt: string
  thumbnail?: string
  display?: string
  highRes?: string
}

interface PhotoDisplayProps {
  photos: Photo[]
  className?: string
  showGallery?: boolean
  maxHeight?: string
}

export default function PhotoDisplay({ 
  photos, 
  className = "", 
  showGallery = true,
  maxHeight = "400px"
}: PhotoDisplayProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Get the best resolution for display based on container size
  const getBestPhotoUrl = (photo: Photo, containerWidth: number = 400): string => {
    if (containerWidth <= 200) return photo.thumbnail || photo.url
    if (containerWidth <= 600) return photo.display || photo.url
    return photo.highRes || photo.display || photo.url
  }

  // Handle zoom
  const handleZoom = (direction: 'in' | 'out') => {
    const zoomFactor = direction === 'in' ? 1.2 : 0.8
    setZoom(prev => Math.max(0.5, Math.min(3, prev * zoomFactor)))
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
  }, [selectedPhoto])

  if (!photos || photos.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height: maxHeight }}>
        <p className="text-gray-500">No photos available</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Photo Display */}
      <div 
        className="relative bg-gray-100 rounded-lg overflow-hidden group"
        style={{ height: maxHeight }}
      >
        <img
          src={getBestPhotoUrl(photos[0], 800)}
          alt={photos[0].alt}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay with controls */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
            {showGallery && photos.length > 1 && (
              <button
                onClick={() => setSelectedPhoto(0)}
                className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                title="View gallery"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Photo count indicator */}
        {photos.length > 1 && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
            {photos.length} photos
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {photos.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {photos.slice(0, 4).map((photo, index) => (
            <div
              key={photo.id}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setSelectedPhoto(index)}
            >
              <img
                src={getBestPhotoUrl(photo, 100)}
                alt={photo.alt}
                className="w-full h-full object-cover"
              />
              {photos.length > 4 && index === 3 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">+{photos.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Full Gallery Modal */}
      {selectedPhoto !== null && showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black bg-opacity-50">
              <h3 className="text-white text-lg font-medium">
                Photo {selectedPhoto + 1} of {photos.length}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleZoom('out')}
                  className="p-2 bg-white bg-opacity-20 rounded text-white hover:bg-opacity-30 transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleZoom('in')}
                  className="p-2 bg-white bg-opacity-20 rounded text-white hover:bg-opacity-30 transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-2 bg-white bg-opacity-20 rounded text-white hover:bg-opacity-30 transition-colors"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Photo Display */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div
                className="relative max-w-full max-h-full overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
              >
                <img
                  src={getBestPhotoUrl(photos[selectedPhoto], 1200)}
                  alt={photos[selectedPhoto].alt}
                  className="max-w-full max-h-full object-contain"
                  style={{
                    transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                  }}
                />
              </div>
            </div>

            {/* Navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedPhoto(selectedPhoto > 0 ? selectedPhoto - 1 : photos.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-20 rounded text-white hover:bg-opacity-30 transition-colors"
                  title="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setSelectedPhoto(selectedPhoto < photos.length - 1 ? selectedPhoto + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-20 rounded text-white hover:bg-opacity-30 transition-colors"
                  title="Next photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="flex space-x-2 p-4 bg-black bg-opacity-50 overflow-x-auto">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhoto(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden ${
                      index === selectedPhoto ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                    } transition-all duration-200`}
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
          </div>
        </div>
      )}
    </div>
  )
}
