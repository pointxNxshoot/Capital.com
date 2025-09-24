'use client'

import { useState } from 'react'
import { Plus, GripVertical, Trash2 } from 'lucide-react'
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
      tags: [],
      order: sections.length
    }

    onSectionsChange([...sections, newSection])
    setIsExpanded(true)
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
    if (sections.length === 0) return 'No additional details'
    
    return sections.map(section => {
      const parts = []
      if (section.imageUrls.length > 0) parts.push(`Photos ${section.imageUrls.length}`)
      if (section.fileUrls.length > 0) parts.push(`Files ${section.fileUrls.length}`)
      if (section.tags.length > 0) parts.push(`Tags ${section.tags.length}`)
      
      const summary = parts.length > 0 ? ` · ${parts.join(' · ')}` : ''
      return `${section.title || 'Untitled'}${summary}`
    }).join(', ')
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Additional Info</h3>
        {!isExpanded && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            aria-label="Expand additional info section"
          >
            <Plus className="h-4 w-4" />
            Add more details
          </button>
        )}
      </div>

      {!isExpanded && sections.length > 0 && (
        <div className="text-sm text-gray-600 mb-4">
          {getSummaryText()}
        </div>
      )}

      {isExpanded && (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={section.id} className="relative">
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Drag to reorder"
                >
                  <GripVertical className="h-4 w-4" />
                </button>
                
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-700">
                    Section {index + 1}
                  </h4>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                    aria-label="Move section up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === sections.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                    aria-label="Move section down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSection(section.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                    aria-label="Delete section"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <DetailBlock
                section={section}
                onUpdate={(updates) => updateSection(section.id, updates)}
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
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              Add Detail Block
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
