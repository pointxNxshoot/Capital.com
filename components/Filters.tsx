'use client'

import { useState } from 'react'
import { X, Filter } from 'lucide-react'

interface FiltersProps {
  categories: string[]
  states: string[]
  tags: string[]
  selectedSector?: string
  selectedState?: string
  selectedTags: string[]
  onSectorChange: (sector: string) => void
  onStateChange: (state: string) => void
  onTagToggle: (tag: string) => void
  onClearFilters: () => void
}

export default function Filters({
  categories,
  states,
  tags,
  selectedSector,
  selectedState,
  selectedTags,
  onSectorChange,
  onStateChange,
  onTagToggle,
  onClearFilters,
}: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const hasActiveFilters = selectedSector || selectedState || selectedTags.length > 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </button>
        )}
      </div>

      {/* Sectors */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Sector</h4>
        <div className="space-y-2">
          {categories.map((sector) => (
            <label key={sector} className="flex items-center">
              <input
                type="radio"
                name="sector"
                value={sector}
                checked={selectedSector === sector}
                onChange={(e) => onSectorChange(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">{sector}</span>
            </label>
          ))}
        </div>
      </div>

      {/* States */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">State</h4>
        <select
          value={selectedState || ''}
          onChange={(e) => onStateChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All states</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
