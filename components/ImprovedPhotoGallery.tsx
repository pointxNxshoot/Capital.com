'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, RotateCw, Move } from 'lucide-react'
import { getBestImageForContainer, ASPECT_RATIOS, type ProcessedImage } from '@/lib/imageUtils'

interface Photo {
  id: string
  processed?: ProcessedImage
  url?: string  // For single URL photos from database
  alt: string
}

interface ImprovedPhotoGalleryProps {
  photos: Photo[]
  className?: string
  heroAspectRatio?: number
  thumbnailAspectRatio?: number
}

export default function ImprovedPhotoGallery({ 
  photos, 
  className = '',
  heroAspectRatio = ASPECT_RATIOS.HERO,
  thumbnailAspectRatio = ASPECT_RATIOS.SQUARE
}: ImprovedPhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const currentPhoto = photos[currentIndex]

  // Helper function to get the best image URL
  const getImageUrl = (photo: Photo, containerWidth: number, containerHeight: number, aspectRatio: number) => {
    if (photo.processed) {
      return getBestImageForContainer(photo.processed, containerWidth, containerHeight, aspectRatio)
    }
    // For single URLs from database, use them directly
    return photo.url || ''
  }

  // Reset zoom and rotation when changing photos
  useEffect(() => {
    setZoom(1)
    setRotation(0)
    setDragOffset({ x: 0, y: 0 })
  }, [currentIndex])

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const goToPhoto = (index: number) => {
    setCurrentIndex(index)
  }

  const resetView = () => {
    setZoom(1)
    setRotation(0)
    setDragOffset({ x: 0, y: 0 })
  }

  const rotatePhoto = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((prev) => Math.min(Math.max(prev * delta, 0.5), 5))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setDragStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setDragOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isFullscreen) return

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        prevPhoto()
        break
      case 'ArrowRight':
        e.preventDefault()
        nextPhoto()
        break
      case 'Escape':
        e.preventDefault()
        setIsFullscreen(false)
        break
      case '+':
      case '=':
        e.preventDefault()
        setZoom((prev) => Math.min(prev * 1.2, 5))
        break
      case '-':
        e.preventDefault()
        setZoom((prev) => Math.max(prev * 0.8, 0.5))
        break
      case 'r':
      case 'R':
        e.preventDefault()
        rotatePhoto()
        break
      case '0':
        e.preventDefault()
        resetView()
        break
    }
  }

  useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isFullscreen])

  if (!photos || photos.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ aspectRatio: heroAspectRatio }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No photos available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Photo Display */}
      <div className="relative">
        <div 
          className="relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
          style={{ aspectRatio: heroAspectRatio }}
          onClick={() => setIsFullscreen(true)}
        >
          <img
            src={getImageUrl(currentPhoto, 1920, 1080, heroAspectRatio)}
            alt={currentPhoto.alt}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            style={{ imageRendering: 'high-quality' }}
          />
          
          {/* Photo Counter */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} of {photos.length}
          </div>

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevPhoto()
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextPhoto()
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* View Photos Button */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            View Photos
          </div>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {photos.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => goToPhoto(index)}
              className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ 
                width: '80px', 
                height: `${80 / thumbnailAspectRatio}px`,
                aspectRatio: thumbnailAspectRatio
              }}
            >
              <img
                src={getImageUrl(photo, 80, 80 / thumbnailAspectRatio, thumbnailAspectRatio)}
                alt={photo.alt}
                className="w-full h-full object-cover"
                style={{ imageRendering: 'high-quality' }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 text-white">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold">
                {currentPhoto.alt} ({currentIndex + 1} of {photos.length})
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={resetView}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Reset view (0)"
              >
                <Move className="w-5 h-5" />
              </button>
              <button
                onClick={rotatePhoto}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Rotate (R)"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Photo Area */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div
              className="relative max-w-full max-h-full overflow-hidden"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={() => setDragStart({ x: 0, y: 0 })}
            >
              <img
                src={getImageUrl(currentPhoto, 2400, 1800, ASPECT_RATIOS.CARD)}
                alt={currentPhoto.alt}
                className="max-w-full max-h-full object-contain select-none"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                  transition: dragStart.x === 0 && dragStart.y === 0 ? 'transform 0.2s ease-out' : 'none',
                  imageRendering: 'high-quality'
                }}
                draggable={false}
              />
            </div>
          </div>

          {/* Navigation Controls */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Bottom Thumbnail Strip */}
          {photos.length > 1 && (
            <div className="flex justify-center space-x-2 p-4 bg-black bg-opacity-50">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => goToPhoto(index)}
                  className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? 'border-white ring-2 ring-blue-400'
                      : 'border-gray-400 hover:border-gray-200'
                  }`}
                  style={{ 
                    width: '64px', 
                    height: `${64 / thumbnailAspectRatio}px`,
                    aspectRatio: thumbnailAspectRatio
                  }}
                >
                  <img
                    src={getImageUrl(photo, 64, 64 / thumbnailAspectRatio, thumbnailAspectRatio)}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'high-quality' }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
            <button
              onClick={() => setZoom((prev) => Math.max(prev * 0.8, 0.5))}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Zoom out (-)"
            >
              <ZoomIn className="w-4 h-4 rotate-180" />
            </button>
            <span className="text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((prev) => Math.min(prev * 1.2, 5))}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Zoom in (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
