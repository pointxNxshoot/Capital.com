'use client'

import { useState } from 'react'
import { Plus, GripVertical, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { AdditionalSection } from '@/lib/validators'
import DetailBlock from './DetailBlock'

interface AdditionalInfoSectionProps {
  sections: AdditionalSection[]
  onSectionsChange: (sections: AdditionalSection[]) => void
  className?: string
}

export default function AdditionalInfoSection({ 
  sections, 
  onSectionsChange, 
  className = "" 
}: AdditionalInfoSectionProps) {
  const [isExpanded, setIsExpanded] = useState(sections.length > 0)

  const addSection = () => {
    if (sections.length >= 10) return

    const newSection: AdditionalSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      description: '',
      imageUrls: [],
      fileUrls: [],
      deck: null,
      tags: [],
      order: sections.length,
      visibility: 'public'
    }

    onSectionsChange([...sections, newSection])
    setIsExpanded(true)
    
    // Emit analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'detail_block_added', {
        listing_id: 'unknown', // Will be set when we have the listing ID
        block_id: newSection.id
      })
    }
  }

  const updateSection = (id: string, updates: Partial<AdditionalSection>) => {
    const updatedSections = sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    )
    onSectionsChange(updatedSections)
  }

  const deleteSection = (id: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      const updatedSections = sections
        .filter(section => section.id !== id)
        .map((section, index) => ({ ...section, order: index }))
      onSectionsChange(updatedSections)
      
      // Emit analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'detail_block_removed', {
          listing_id: 'unknown', // Will be set when we have the listing ID
          block_id: id
        })
      }
    }
  }

  const moveSection = (fromIndex: number, toIndex: number) => {
    const newSections = [...sections]
    const [movedSection] = newSections.splice(fromIndex, 1)
    newSections.splice(toIndex, 0, movedSection)
    
    // Update order values
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      order: index
    }))
    
    onSectionsChange(reorderedSections)
    
    // Emit analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'detail_block_reordered', {
        listing_id: 'unknown', // Will be set when we have the listing ID
        block_id: movedSection.id,
        from_index: fromIndex,
        to_index: toIndex
      })
    }
  }

  const moveUp = (index: number) => {
    if (index > 0) {
      moveSection(index, index - 1)
    }
  }

  const moveDown = (index: number) => {
    if (index < sections.length - 1) {
      moveSection(index, index + 1)
    }
  }

  const getSummaryText = () => {
    if (sections.length === 0) return 'No additional materials'
    
    return sections.map(section => {
      const parts = []
      if (section.imageUrls.length > 0) parts.push(`Photos ${section.imageUrls.length}`)
      if (section.fileUrls.length > 0) parts.push(`Files ${section.fileUrls.length}`)
      if (section.deck?.type) parts.push(`Deck ✓`)
      if (section.tags.length > 0) parts.push(`Tags ${section.tags.length}`)
      
      const summary = parts.length > 0 ? ` · ${parts.join(' · ')}` : ''
      return `${section.title || 'Untitled'}${summary}`
    }).join(', ')
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Compact Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsExpanded(!isExpanded)
          }
        }}
        aria-expanded={isExpanded}
        aria-label="Additional Materials section"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Additional Materials</h3>
          {sections.length > 0 && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {sections.length} block{sections.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!isExpanded && sections.length > 0 && (
            <div className="text-sm text-gray-600 max-w-md truncate">
              {getSummaryText()}
            </div>
          )}
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          {sections.map((section, index) => (
            <div key={section.id} className="relative">
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 p-1 cursor-grab active:cursor-grabbing"
                  aria-label={`Drag to reorder detail block ${index + 1}`}
                  title="Drag to reorder"
                >
                  <GripVertical className="h-4 w-4" />
                </button>
                
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-700">
                    Detail Block {index + 1}
                  </h4>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                    aria-label={`Move detail block ${index + 1} up`}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === sections.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                    aria-label={`Move detail block ${index + 1} down`}
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSection(section.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                    aria-label={`Delete detail block ${index + 1}`}
                    title="Delete block"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <DetailBlock
                section={section}
                onUpdate={(updates: Partial<AdditionalSection>) => updateSection(section.id, updates)}
              />
            </div>
          ))}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Collapse section
            </button>
            
            <button
              type="button"
              onClick={addSection}
              disabled={sections.length >= 10}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Add new detail block"
            >
              <Plus className="h-4 w-4" />
              ＋ Add Detail Block
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
