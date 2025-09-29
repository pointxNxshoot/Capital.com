'use client'

import { useState } from 'react'
import { FileText, Image, Tag, Link, File, Download, ExternalLink, Eye } from 'lucide-react'
import { AdditionalSection } from '@/lib/validators'

interface PublicAdditionalMaterialsProps {
  sections: AdditionalSection[]
  className?: string
}

export default function PublicAdditionalMaterials({ 
  sections, 
  className = "" 
}: PublicAdditionalMaterialsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'xls':
      case 'xlsx':
        return <FileText className="h-4 w-4 text-green-500" />
      case 'csv':
        return <FileText className="h-4 w-4 text-yellow-500" />
      case 'txt':
        return <FileText className="h-4 w-4 text-gray-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
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

  const openDeck = (deck: { type: 'pdf' | 'link'; url: string }) => {
    if (deck.type === 'pdf') {
      // Open PDF in new tab
      window.open(deck.url, '_blank')
    } else {
      // Open link in new tab
      window.open(deck.url, '_blank')
    }
  }

  if (!sections || sections.length === 0) {
    return null
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Materials</h2>
        
        <div className="space-y-4">
          {sections.map((section, index) => {
            const isExpanded = expandedSections.has(section.id)
            const hasContent = section.imageUrls.length > 0 || section.fileUrls.length > 0 || section.deck || section.tags.length > 0
            
            return (
              <div key={section.id} className="border border-gray-200 rounded-lg">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection(section.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggleSection(section.id)
                    }
                  }}
                  aria-expanded={isExpanded}
                  aria-label={`${section.title} - Click to expand`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">{section.title}</h3>
                      {hasContent && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {section.imageUrls.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Image className="h-3 w-3" />
                              {section.imageUrls.length}
                            </span>
                          )}
                          {section.fileUrls.length > 0 && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {section.fileUrls.length}
                            </span>
                          )}
                          {section.deck && (
                            <span className="flex items-center gap-1">
                              <File className="h-3 w-3" />
                              Deck
                            </span>
                          )}
                          {section.tags.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {section.tags.length}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <Eye className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {section.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {section.description}
                    </p>
                  )}
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 space-y-4">
                    {/* Description */}
                    {section.description && (
                      <div>
                        <p className="text-gray-700 whitespace-pre-wrap">{section.description}</p>
                      </div>
                    )}

                    {/* Pitch Deck */}
                    {section.deck && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <File className="h-4 w-4" />
                          Pitch Deck
                        </h4>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            {section.deck.type === 'pdf' ? (
                              <FileText className="h-5 w-5 text-red-500" />
                            ) : (
                              <Link className="h-5 w-5 text-blue-500" />
                            )}
                            <span className="text-sm font-medium">
                              {section.deck.type === 'pdf' ? 'PDF Document' : 'External Link'}
                            </span>
                          </div>
                          <button
                            onClick={() => openDeck(section.deck!)}
                            className="ml-auto flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                          >
                            {section.deck.type === 'pdf' ? (
                              <>
                                <Eye className="h-3 w-3" />
                                View PDF
                              </>
                            ) : (
                              <>
                                <ExternalLink className="h-3 w-3" />
                                View Deck
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Images */}
                    {section.imageUrls.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          Images ({section.imageUrls.length})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {section.imageUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`${section.title} - Image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(url, '_blank')}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                                <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Files */}
                    {section.fileUrls.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Documents ({section.fileUrls.length})
                        </h4>
                        <div className="space-y-2">
                          {section.fileUrls.map((url, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                {getFileIcon(url)}
                                <div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {getFileName(url)}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => window.open(url, '_blank')}
                                className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {section.tags.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Tags ({section.tags.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {section.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
