'use client'

import { useState, useRef } from 'react'
import { Upload, X, FileText, Image, Tag, Plus, Link, File } from 'lucide-react'
import { AdditionalSection } from '@/lib/validators'

interface DetailBlockProps {
  section: AdditionalSection
  onUpdate: (updates: Partial<AdditionalSection>) => void
}

interface UploadedFile {
  url: string
  name: string
  size: number
}

export default function DetailBlock({ section, onUpdate }: DetailBlockProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<string[]>([])
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])
  const [uploadingDeck, setUploadingDeck] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [deckLink, setDeckLink] = useState('')
  const [deckError, setDeckError] = useState('')
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const deckInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (files: FileList) => {
    const newFiles = Array.from(files).slice(0, 10 - section.imageUrls.length)
    
    for (const file of newFiles) {
      const tempId = Math.random().toString(36).substr(2, 9)
      setUploadingImages(prev => [...prev, tempId])
      
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'image')
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (response.ok) {
          const { url } = await response.json()
          onUpdate({
            imageUrls: [...section.imageUrls, url]
          })
          
          // Emit analytics event
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'asset_uploaded', {
              listing_id: 'unknown',
              block_id: section.id,
              type: 'image',
              file_type: file.type
            })
          }
        } else {
          const error = await response.json()
          alert(`Failed to upload image: ${error.error}`)
        }
      } catch (error) {
        alert('Failed to upload image. Please try again.')
      } finally {
        setUploadingImages(prev => prev.filter(id => id !== tempId))
      }
    }
  }

  const handleFileUpload = async (files: FileList) => {
    const newFiles = Array.from(files).slice(0, 10 - section.fileUrls.length)
    
    for (const file of newFiles) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`)
        continue
      }
      
      const tempId = Math.random().toString(36).substr(2, 9)
      setUploadingFiles(prev => [...prev, tempId])
      
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'document')
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (response.ok) {
          const { url } = await response.json()
          onUpdate({
            fileUrls: [...section.fileUrls, url]
          })
          
          // Emit analytics event
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'asset_uploaded', {
              listing_id: 'unknown',
              block_id: section.id,
              type: 'file',
              file_type: file.type
            })
          }
        } else {
          const error = await response.json()
          alert(`Failed to upload file: ${error.error}`)
        }
      } catch (error) {
        alert('Failed to upload file. Please try again.')
      } finally {
        setUploadingFiles(prev => prev.filter(id => id !== tempId))
      }
    }
  }

  const handleDeckUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setDeckError('File is too large. Maximum size is 10MB.')
      return
    }
    
    if (file.type !== 'application/pdf') {
      setDeckError('Only PDF files are allowed for pitch decks.')
      return
    }
    
    setUploadingDeck(true)
    setDeckError('')
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'document')
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const { url } = await response.json()
        onUpdate({
          deck: { type: 'pdf', url }
        })
        
        // Emit analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'asset_uploaded', {
            listing_id: 'unknown',
            block_id: section.id,
            type: 'deck',
            file_type: 'pdf'
          })
        }
      } else {
        const error = await response.json()
        setDeckError(`Failed to upload deck: ${error.error}`)
      }
    } catch (error) {
      setDeckError('Failed to upload deck. Please try again.')
    } finally {
      setUploadingDeck(false)
    }
  }

  const handleDeckLink = () => {
    if (!deckLink.trim()) {
      setDeckError('Please enter a valid link')
      return
    }
    
    // Basic URL validation
    try {
      new URL(deckLink)
      onUpdate({
        deck: { type: 'link', url: deckLink.trim() }
      })
      setDeckLink('')
      setDeckError('')
      
      // Emit analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'asset_uploaded', {
          listing_id: 'unknown',
          block_id: section.id,
          type: 'deck',
          file_type: 'link'
        })
      }
    } catch {
      setDeckError('Please enter a valid URL')
    }
  }

  const removeDeck = () => {
    onUpdate({ deck: null })
    
    // Emit analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'asset_removed', {
        listing_id: 'unknown',
        block_id: section.id,
        type: 'deck'
      })
    }
  }

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleImageUpload(files)
    }
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const removeImage = (index: number) => {
    const newImages = section.imageUrls.filter((_, i) => i !== index)
    onUpdate({ imageUrls: newImages })
    
    // Emit analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'asset_removed', {
        listing_id: 'unknown',
        block_id: section.id,
        type: 'image'
      })
    }
  }

  const removeFile = (index: number) => {
    const newFiles = section.fileUrls.filter((_, i) => i !== index)
    onUpdate({ fileUrls: newFiles })
    
    // Emit analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'asset_removed', {
        listing_id: 'unknown',
        block_id: section.id,
        type: 'file'
      })
    }
  }

  const addTag = () => {
    if (newTag.trim() && section.tags.length < 8 && !section.tags.includes(newTag.trim())) {
      onUpdate({ tags: [...section.tags, newTag.trim()] })
      setNewTag('')
    }
  }

  const removeTag = (index: number) => {
    const newTags = section.tags.filter((_, i) => i !== index)
    onUpdate({ tags: newTags })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileName = (url: string) => {
    const parts = url.split('/')
    return parts[parts.length - 1] || 'Unknown file'
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={section.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Enter section title"
          maxLength={120}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <div className="text-xs text-gray-500 mt-1">
          {section.title.length}/120 characters
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={section.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Enter section description"
          maxLength={2000}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="text-xs text-gray-500 mt-1">
          {(section.description || '').length}/2000 characters
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images ({section.imageUrls.length}/10)
        </label>
        
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center ${
            isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleImageDrop}
        >
          <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop images here, or click to select
          </p>
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            Upload Images
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Image thumbnails */}
        {(section.imageUrls.length > 0 || uploadingImages.length > 0) && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {section.imageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {uploadingImages.map((id) => (
              <div key={id} className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-xs text-gray-500">Uploading...</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Files */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Files ({section.fileUrls.length}/10)
        </label>
        
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center ${
            isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleFileDrop}
        >
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files here, or click to select
          </p>
          <p className="text-xs text-gray-500 mb-2">
            PDF, DOCX, CSV, JPEG, PNG (max 10MB each)
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Upload className="h-4 w-4" />
            Upload Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.csv,image/*"
            multiple
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
          />
        </div>

        {/* File list */}
        {(section.fileUrls.length > 0 || uploadingFiles.length > 0) && (
          <div className="space-y-2 mt-3">
            {section.fileUrls.map((url, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{getFileName(url)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {uploadingFiles.map((id) => (
              <div key={id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Uploading...</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pitch Deck */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pitch Deck
        </label>
        
        {section.deck ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              {section.deck.type === 'pdf' ? (
                <File className="h-4 w-4 text-green-600" />
              ) : (
                <Link className="h-4 w-4 text-green-600" />
              )}
              <span className="text-sm text-green-800">
                {section.deck.type === 'pdf' ? 'PDF uploaded' : 'Link added'}
              </span>
            </div>
            <button
              type="button"
              onClick={removeDeck}
              className="text-red-500 hover:text-red-700"
              aria-label="Remove pitch deck"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* PDF Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <File className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Upload a PDF pitch deck
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Maximum 10MB
              </p>
              <button
                type="button"
                onClick={() => deckInputRef.current?.click()}
                disabled={uploadingDeck}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-4 w-4" />
                {uploadingDeck ? 'Uploading...' : 'Upload PDF'}
              </button>
              <input
                ref={deckInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files?.[0] && handleDeckUpload(e.target.files[0])}
                className="hidden"
              />
            </div>
            
            {/* OR Divider */}
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-sm text-gray-500">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            
            {/* Link Input */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={deckLink}
                  onChange={(e) => setDeckLink(e.target.value)}
                  placeholder="Paste Google Slides, Drive, or Canva link"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleDeckLink}
                  disabled={!deckLink.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Link
                </button>
              </div>
              {deckError && (
                <p className="text-sm text-red-600">{deckError}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags ({section.tags.length}/8)
        </label>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {section.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              <Tag className="h-3 w-3" />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add a tag"
            maxLength={24}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={addTag}
            disabled={!newTag.trim() || section.tags.length >= 8}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Press Enter or click + to add tag
        </div>
      </div>
    </div>
  )
}
