'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Crop, RotateCcw, Check } from 'lucide-react'

interface ImageCropUploadProps {
  onImageSelect: (file: File | null) => void
  currentImage?: string
  placeholder?: string
  className?: string
  aspectRatio?: number
}

export default function ImageCropUpload({ 
  onImageSelect, 
  currentImage, 
  placeholder = "Upload image",
  className = "",
  aspectRatio = 1
}: ImageCropUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [cropData, setCropData] = useState({ x: 0, y: 0, width: 100, height: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCropImage(result)
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
    
    const width = Math.abs(currentX - dragStart.x)
    const height = Math.abs(currentY - dragStart.y)
    const x = Math.min(dragStart.x, currentX)
    const y = Math.min(dragStart.y, currentY)
    
    // Maintain aspect ratio
    const adjustedHeight = width / aspectRatio
    const adjustedWidth = height * aspectRatio
    
    setCropData({
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: Math.min(width, adjustedWidth, rect.width - x),
      height: Math.min(height, adjustedHeight, rect.height - y)
    })
  }

  const handleCropEnd = () => {
    setIsDragging(false)
  }

  const handleCropImage = () => {
    if (!cropImage || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      // Set canvas size to crop dimensions
      canvas.width = cropData.width
      canvas.height = cropData.height

      // Calculate source dimensions based on crop area
      const sourceX = (cropData.x / 300) * img.width
      const sourceY = (cropData.y / 300) * img.height
      const sourceWidth = (cropData.width / 300) * img.width
      const sourceHeight = (cropData.height / 300) * img.height

      // Draw cropped image
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, cropData.width, cropData.height
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

      {/* Crop Modal */}
      {showCropModal && cropImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Crop className="h-5 w-5 mr-2" />
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
                className="relative border-2 border-gray-300 rounded-lg overflow-hidden mx-auto"
                style={{ width: 300, height: 300 / aspectRatio }}
                onMouseDown={handleCropStart}
                onMouseMove={handleCropMove}
                onMouseUp={handleCropEnd}
                onMouseLeave={handleCropEnd}
              >
                <img
                  src={cropImage}
                  alt="Crop preview"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                
                {/* Crop overlay */}
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 cursor-move"
                  style={{
                    left: cropData.x,
                    top: cropData.y,
                    width: cropData.width,
                    height: cropData.height
                  }}
                />
              </div>
              
              <p className="text-sm text-gray-600 mt-2 text-center">
                Drag to select crop area (maintains {aspectRatio}:1 ratio)
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
