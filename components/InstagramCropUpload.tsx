'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, RotateCcw, Check, Move, ZoomIn, ZoomOut } from 'lucide-react'

interface InstagramCropUploadProps {
  onImageSelect: (file: File | null) => void
  currentImage?: string
  placeholder?: string
  className?: string
  aspectRatio?: number
}

export default function InstagramCropUpload({ 
  onImageSelect, 
  currentImage, 
  placeholder = "Upload image",
  className = "",
  aspectRatio = 1
}: InstagramCropUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCropImage(result)
        setScale(1)
        setPosition({ x: 0, y: 0 })
        setLastPosition({ x: 0, y: 0 })
        setShowCropModal(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onImageSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setLastPosition(position)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    setPosition({
      x: lastPosition.x + deltaX,
      y: lastPosition.y + deltaY
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setLastPosition(position)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale(prev => Math.max(0.5, Math.min(3, prev * delta)))
  }

  const handleScaleChange = (newScale: number) => {
    setScale(Math.max(0.5, Math.min(3, newScale)))
  }

  const resetCrop = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setLastPosition({ x: 0, y: 0 })
  }

  const handleCropImage = () => {
    if (!cropImage || !canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const cropSize = Math.min(containerRect.width, containerRect.height / aspectRatio)

    const img = new Image()
    img.onload = () => {
      // Set canvas size to crop dimensions
      canvas.width = cropSize
      canvas.height = cropSize / aspectRatio

      // Calculate image dimensions and position
      const imgAspectRatio = img.width / img.height
      const cropAspectRatio = aspectRatio
      
      let imgWidth, imgHeight, imgX, imgY
      
      if (imgAspectRatio > cropAspectRatio) {
        // Image is wider than crop area
        imgHeight = cropSize / aspectRatio
        imgWidth = imgHeight * imgAspectRatio
        imgX = (cropSize - imgWidth) / 2
        imgY = 0
      } else {
        // Image is taller than crop area
        imgWidth = cropSize
        imgHeight = cropSize / imgAspectRatio
        imgX = 0
        imgY = (cropSize / aspectRatio - imgHeight) / 2
      }

      // Apply scale and position
      const scaledWidth = imgWidth * scale
      const scaledHeight = imgHeight * scale
      const scaledX = imgX + (imgWidth - scaledWidth) / 2 + position.x
      const scaledY = imgY + (imgHeight - scaledHeight) / 2 + position.y

      // Draw scaled and positioned image
      ctx.drawImage(
        img,
        scaledX, scaledY, scaledWidth, scaledHeight,
        0, 0, cropSize, cropSize / aspectRatio
      )

      // Convert to blob and create file
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'cropped-image.png', { type: 'image/png' })
          onImageSelect(file)
          setPreview(URL.createObjectURL(blob))
          setShowCropModal(false)
        }
      }, 'image/png')
    }
    img.src = cropImage
  }

  const handleCancelCrop = () => {
    setShowCropModal(false)
    setCropImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${preview ? 'p-2' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleRemove()
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-1">{placeholder}</p>
            <p className="text-xs text-gray-400">Click to upload or drag and drop</p>
          </div>
        )}
      </div>

      {/* Instagram-style Crop Modal */}
      {showCropModal && cropImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Crop Image
              </h3>
              <button
                onClick={handleCancelCrop}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <div 
                ref={containerRef}
                className="relative border-2 border-gray-300 rounded-lg overflow-hidden mx-auto bg-gray-100"
                style={{ 
                  width: 400, 
                  height: 400 / aspectRatio,
                  aspectRatio: aspectRatio
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              >
                <img
                  src={cropImage}
                  alt="Crop preview"
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  draggable={false}
                  style={{
                    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                    transformOrigin: 'center center'
                  }}
                />
                
                {/* Crop overlay with Instagram-style corners */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                  
                  {/* Crop area */}
                  <div 
                    className="absolute border-2 border-white"
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
                  onClick={resetCrop}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </button>
                
                <div className="flex items-center space-x-2">
                  <ZoomOut className="h-4 w-4 text-gray-400" />
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={scale}
                    onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                    className="w-24"
                  />
                  <ZoomIn className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="text-sm text-gray-600">
                  {Math.round(scale * 100)}%
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-2 text-center">
                Drag to move • Scroll or use slider to zoom • Maintains {aspectRatio}:1 ratio
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelCrop}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCropImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Check className="h-4 w-4 mr-2" />
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
