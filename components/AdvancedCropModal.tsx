'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { X, RotateCcw, Download, Lock, Unlock } from 'lucide-react'

interface CropData {
  x: number
  y: number
  width: number
  height: number
}

interface AdvancedCropModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  aspectRatio: number
  onCrop: (croppedDataUrl: string) => void
}

export default function AdvancedCropModal({ 
  isOpen, 
  onClose, 
  imageSrc, 
  aspectRatio, 
  onCrop 
}: AdvancedCropModalProps) {
  // Refs
  const previewImageRef = useRef<HTMLImageElement>(null)
  const cropOverlayRef = useRef<HTMLDivElement>(null)
  const cropSelectionRef = useRef<HTMLDivElement>(null)
  const originalImageRef = useRef<HTMLImageElement | null>(null)
  
  // State
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [aspectRatioLocked, setAspectRatioLocked] = useState(aspectRatio === 1)
  const [showSpinner, setShowSpinner] = useState(false)
  
  // Crop data in natural (source) pixels
  const [naturalCropData, setNaturalCropData] = useState<CropData>({
    x: 0, y: 0, width: 0, height: 0
  })
  
  // Crop data in screen (CSS) pixels
  const [screenCropData, setScreenCropData] = useState<CropData>({
    x: 0, y: 0, width: 0, height: 0
  })
  
  // Scale factor between natural and screen pixels
  const [scaleFactor, setScaleFactor] = useState(1)
  
  // Mouse tracking
  const [initialMouse, setInitialMouse] = useState({ x: 0, y: 0 })
  const [initialCrop, setInitialCrop] = useState<CropData>({ x: 0, y: 0, width: 0, height: 0 })
  
  // Input values
  const [inputValues, setInputValues] = useState({
    x: 0, y: 0, width: 0, height: 0
  })

  // Load and initialize image
  useEffect(() => {
    if (!isOpen || !imageSrc) return
    
    setShowSpinner(true)
    const img = new Image()
    img.onload = () => {
      originalImageRef.current = img
      setIsImageLoaded(true)
      setShowSpinner(false)
      
      // Wait for layout to stabilize
      setTimeout(() => {
        initializeImageDisplay()
      }, 50)
    }
    img.src = imageSrc
  }, [isOpen, imageSrc])

  // Initialize image display and set default crop
  const initializeImageDisplay = useCallback(() => {
    if (!originalImageRef.current || !previewImageRef.current) return
    
    const img = originalImageRef.current
    const preview = previewImageRef.current
    
    // Calculate scale factor
    const scaleX = preview.clientWidth / img.naturalWidth
    const scaleY = preview.clientHeight / img.naturalHeight
    const newScaleFactor = Math.min(scaleX, scaleY)
    setScaleFactor(newScaleFactor)
    
    // Set default crop (centered, 60% of image)
    const defaultWidth = img.naturalWidth * 0.6
    const defaultHeight = aspectRatioLocked ? defaultWidth / aspectRatio : defaultWidth * 0.75
    
    const defaultX = (img.naturalWidth - defaultWidth) / 2
    const defaultY = (img.naturalHeight - defaultHeight) / 2
    
    const naturalCrop = {
      x: defaultX,
      y: defaultY,
      width: defaultWidth,
      height: defaultHeight
    }
    
    const screenCrop = {
      x: defaultX * newScaleFactor,
      y: defaultY * newScaleFactor,
      width: defaultWidth * newScaleFactor,
      height: defaultHeight * newScaleFactor
    }
    
    setNaturalCropData(naturalCrop)
    setScreenCropData(screenCrop)
    setInputValues({
      x: Math.round(defaultX),
      y: Math.round(defaultY),
      width: Math.round(defaultWidth),
      height: Math.round(defaultHeight)
    })
    
    updateMasks()
  }, [aspectRatio, aspectRatioLocked])

  // Update mask overlays
  const updateMasks = useCallback(() => {
    if (!cropOverlayRef.current || !cropSelectionRef.current) return
    
    const overlay = cropOverlayRef.current
    const selection = cropSelectionRef.current
    const overlayRect = overlay.getBoundingClientRect()
    const selectionRect = selection.getBoundingClientRect()
    
    const overlayLeft = selectionRect.left - overlayRect.left
    const overlayTop = selectionRect.top - overlayRect.top
    const overlayRight = overlayRect.width - (overlayLeft + selectionRect.width)
    const overlayBottom = overlayRect.height - (overlayTop + selectionRect.height)
    
    // Update mask elements
    const masks = overlay.querySelectorAll('.mask')
    if (masks.length >= 4) {
      ;(masks[0] as HTMLElement).style.cssText = `top: 0; left: 0; right: 0; height: ${overlayTop}px;`
      ;(masks[1] as HTMLElement).style.cssText = `top: ${overlayTop}px; left: 0; width: ${overlayLeft}px; bottom: ${overlayBottom}px;`
      ;(masks[2] as HTMLElement).style.cssText = `top: ${overlayTop}px; right: 0; width: ${overlayRight}px; bottom: ${overlayBottom}px;`
      ;(masks[3] as HTMLElement).style.cssText = `bottom: 0; left: 0; right: 0; height: ${overlayBottom}px;`
    }
  }, [])

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isImageLoaded) return
    
    const rect = cropSelectionRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    setInitialMouse({ x: e.clientX, y: e.clientY })
    setInitialCrop({ ...screenCropData })
    
    // Check if clicking on resize handle
    const handleSize = 12
    const isOnHandle = 
      (mouseX < handleSize && mouseY < handleSize) || // nw
      (mouseX > rect.width - handleSize && mouseY < handleSize) || // ne
      (mouseX < handleSize && mouseY > rect.height - handleSize) || // sw
      (mouseX > rect.width - handleSize && mouseY > rect.height - handleSize) // se
    
    if (isOnHandle) {
      setIsResizing(true)
      if (mouseX < handleSize && mouseY < handleSize) setResizeHandle('nw')
      else if (mouseX > rect.width - handleSize && mouseY < handleSize) setResizeHandle('ne')
      else if (mouseX < handleSize && mouseY > rect.height - handleSize) setResizeHandle('sw')
      else setResizeHandle('se')
    } else {
      setIsDragging(true)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isImageLoaded) return
    
    if (isDragging) {
      moveCropSelection(e)
    } else if (isResizing) {
      resizeCropSelection(e)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }

  // Move crop selection
  const moveCropSelection = (e: React.MouseEvent) => {
    const deltaX = e.clientX - initialMouse.x
    const deltaY = e.clientY - initialMouse.y
    
    const newX = Math.max(0, Math.min(
      initialCrop.x + deltaX,
      (previewImageRef.current?.clientWidth || 0) - initialCrop.width
    ))
    const newY = Math.max(0, Math.min(
      initialCrop.y + deltaY,
      (previewImageRef.current?.clientHeight || 0) - initialCrop.height
    ))
    
    const newScreenCrop = {
      ...initialCrop,
      x: newX,
      y: newY
    }
    
    const newNaturalCrop = {
      x: newX / scaleFactor,
      y: newY / scaleFactor,
      width: initialCrop.width / scaleFactor,
      height: initialCrop.height / scaleFactor
    }
    
    setScreenCropData(newScreenCrop)
    setNaturalCropData(newNaturalCrop)
    setInputValues({
      x: Math.round(newNaturalCrop.x),
      y: Math.round(newNaturalCrop.y),
      width: Math.round(newNaturalCrop.width),
      height: Math.round(newNaturalCrop.height)
    })
    
    updateMasks()
  }

  // Resize crop selection
  const resizeCropSelection = (e: React.MouseEvent) => {
    if (!resizeHandle) return
    
    const deltaX = e.clientX - initialMouse.x
    const deltaY = e.clientY - initialMouse.y
    
    let newWidth = initialCrop.width
    let newHeight = initialCrop.height
    let newX = initialCrop.x
    let newY = initialCrop.y
    
    switch (resizeHandle) {
      case 'nw':
        newWidth = Math.max(20, initialCrop.width - deltaX)
        newHeight = aspectRatioLocked ? newWidth / aspectRatio : initialCrop.height - deltaY
        newX = initialCrop.x + (initialCrop.width - newWidth)
        newY = initialCrop.y + (initialCrop.height - newHeight)
        break
      case 'ne':
        newWidth = Math.max(20, initialCrop.width + deltaX)
        newHeight = aspectRatioLocked ? newWidth / aspectRatio : initialCrop.height - deltaY
        newY = initialCrop.y + (initialCrop.height - newHeight)
        break
      case 'sw':
        newWidth = Math.max(20, initialCrop.width - deltaX)
        newHeight = aspectRatioLocked ? newWidth / aspectRatio : initialCrop.height + deltaY
        newX = initialCrop.x + (initialCrop.width - newWidth)
        break
      case 'se':
        newWidth = Math.max(20, initialCrop.width + deltaX)
        newHeight = aspectRatioLocked ? newWidth / aspectRatio : initialCrop.height + deltaY
        break
    }
    
    // Clamp to image bounds
    const maxWidth = (previewImageRef.current?.clientWidth || 0) - newX
    const maxHeight = (previewImageRef.current?.clientHeight || 0) - newY
    
    newWidth = Math.min(newWidth, maxWidth)
    newHeight = Math.min(newHeight, maxHeight)
    
    const newScreenCrop = {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    }
    
    const newNaturalCrop = {
      x: newX / scaleFactor,
      y: newY / scaleFactor,
      width: newWidth / scaleFactor,
      height: newHeight / scaleFactor
    }
    
    setScreenCropData(newScreenCrop)
    setNaturalCropData(newNaturalCrop)
    setInputValues({
      x: Math.round(newNaturalCrop.x),
      y: Math.round(newNaturalCrop.y),
      width: Math.round(newNaturalCrop.width),
      height: Math.round(newNaturalCrop.height)
    })
    
    updateMasks()
  }

  // Handle input changes
  const handleInputChange = (field: string, value: number) => {
    if (!originalImageRef.current) return
    
    const img = originalImageRef.current
    const newValues = { ...inputValues, [field]: value }
    
    // Clamp values
    newValues.x = Math.max(0, Math.min(newValues.x, img.naturalWidth - newValues.width))
    newValues.y = Math.max(0, Math.min(newValues.y, img.naturalHeight - newValues.height))
    newValues.width = Math.max(20, Math.min(newValues.width, img.naturalWidth - newValues.x))
    newValues.height = Math.max(20, Math.min(newValues.height, img.naturalHeight - newValues.y))
    
    // Maintain aspect ratio if locked
    if (aspectRatioLocked) {
      if (field === 'width') {
        newValues.height = newValues.width / aspectRatio
      } else if (field === 'height') {
        newValues.width = newValues.height * aspectRatio
      }
    }
    
    const newNaturalCrop = {
      x: newValues.x,
      y: newValues.y,
      width: newValues.width,
      height: newValues.height
    }
    
    const newScreenCrop = {
      x: newValues.x * scaleFactor,
      y: newValues.y * scaleFactor,
      width: newValues.width * scaleFactor,
      height: newValues.height * scaleFactor
    }
    
    setInputValues(newValues)
    setNaturalCropData(newNaturalCrop)
    setScreenCropData(newScreenCrop)
    updateMasks()
  }

  // Perform crop
  const performCrop = () => {
    if (!originalImageRef.current) return
    
    setShowSpinner(true)
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = Math.round(naturalCropData.width)
    canvas.height = Math.round(naturalCropData.height)
    
    // Enable high-quality image smoothing
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    
    // Draw cropped image
    ctx.drawImage(
      originalImageRef.current,
      naturalCropData.x, naturalCropData.y,
      naturalCropData.width, naturalCropData.height,
      0, 0,
      naturalCropData.width, naturalCropData.height
    )
    
    // Convert to data URL
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9)
    onCrop(croppedDataUrl)
    setShowSpinner(false)
  }

  // Reset crop
  const resetCrop = () => {
    initializeImageDisplay()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {aspectRatio === 1 ? 'Crop Profile Picture' : 'Crop Image'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main crop area */}
        <div className="relative mb-4">
          <div className="relative inline-block">
            <img
              ref={previewImageRef}
              src={imageSrc}
              alt="Crop preview"
              className="max-w-full max-h-96 object-contain"
              style={{ display: isImageLoaded ? 'block' : 'none' }}
            />
            
            {/* Crop overlay */}
            <div
              ref={cropOverlayRef}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Mask overlays */}
              <div className="mask absolute bg-black bg-opacity-50"></div>
              <div className="mask absolute bg-black bg-opacity-50"></div>
              <div className="mask absolute bg-black bg-opacity-50"></div>
              <div className="mask absolute bg-black bg-opacity-50"></div>
              
              {/* Crop selection */}
              <div
                ref={cropSelectionRef}
                className="absolute border-2 border-white border-dashed cursor-move"
                style={{
                  left: screenCropData.x,
                  top: screenCropData.y,
                  width: screenCropData.width,
                  height: screenCropData.height,
                  pointerEvents: 'auto'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Resize handles */}
                <div className="resize-handle absolute -top-1 -left-1 w-3 h-3 bg-white border border-gray-400 cursor-nw-resize"></div>
                <div className="resize-handle absolute -top-1 -right-1 w-3 h-3 bg-white border border-gray-400 cursor-ne-resize"></div>
                <div className="resize-handle absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-gray-400 cursor-sw-resize"></div>
                <div className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-gray-400 cursor-se-resize"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Aspect ratio toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
              className={`p-2 rounded ${aspectRatioLocked ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {aspectRatioLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
            <span className="text-sm">
              {aspectRatioLocked ? 'Aspect ratio locked' : 'Free aspect ratio'}
            </span>
          </div>

          {/* Numeric inputs */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">X</label>
              <input
                type="number"
                value={inputValues.x}
                onChange={(e) => handleInputChange('x', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Y</label>
              <input
                type="number"
                value={inputValues.y}
                onChange={(e) => handleInputChange('y', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Width</label>
              <input
                type="number"
                value={inputValues.width}
                onChange={(e) => handleInputChange('width', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Height</label>
              <input
                type="number"
                value={inputValues.height}
                onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 border rounded"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={resetCrop}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={performCrop}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Crop</span>
            </button>
          </div>
        </div>

        {/* Spinner */}
        {showSpinner && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  )
}
