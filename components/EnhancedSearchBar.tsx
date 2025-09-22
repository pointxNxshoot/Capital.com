'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Building2, MapPin, Tag } from 'lucide-react'

interface SearchResult {
  id: string
  name: string
  description: string
  sector: string
  industry: string
  suburb: string
  state: string
  tags: string[]
  slug: string
  logoUrl?: string
}

interface SearchResponse {
  hits: SearchResult[]
  totalHits: number
  offset: number
  limit: number
}

interface AutocompleteResponse {
  suggestions: string[]
}

interface EnhancedSearchBarProps {
  variant?: 'header' | 'hero'
  placeholder?: string
}

export default function EnhancedSearchBar({ 
  variant = 'header', 
  placeholder = "Search companies, sectors, locations..." 
}: EnhancedSearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search and autocomplete
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query)
        getAutocompleteSuggestions(query)
      } else {
        setResults([])
        setSuggestions([])
        setIsOpen(false)
        setShowSuggestions(false)
      }
    }, 200) // Reduced delay for better UX

    return () => clearTimeout(timeoutId)
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
      const data: SearchResponse = await response.json()
      setResults(data.hits || [])
      setIsOpen(true)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const getAutocompleteSuggestions = async (searchQuery: string) => {
    try {
      const response = await fetch(`/api/autocomplete?q=${encodeURIComponent(searchQuery)}&limit=5`)
      const data: AutocompleteResponse = await response.json()
      setSuggestions(data.suggestions || [])
      setShowSuggestions(true)
    } catch (error) {
      console.error('Autocomplete error:', error)
      setSuggestions([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = results.length + suggestions.length
    
    if (!isOpen && !showSuggestions) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < totalItems - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex])
        } else if (selectedIndex >= results.length && selectedIndex < totalItems) {
          // Handle suggestion selection
          const suggestionIndex = selectedIndex - results.length
          handleSuggestionClick(suggestions[suggestionIndex])
        } else if (query.trim()) {
          // Navigate to search results page
          router.push(`/companies?q=${encodeURIComponent(query)}`)
          setIsOpen(false)
          setShowSuggestions(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleResultClick = (result: SearchResult) => {
    router.push(`/companies/${result.slug}`)
    setIsOpen(false)
    setShowSuggestions(false)
    setQuery('')
    setSelectedIndex(-1)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    // Trigger search with the suggestion
    performSearch(suggestion)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setSelectedIndex(-1)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setSuggestions([])
    setIsOpen(false)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const getHighlightedText = (text: string, query: string) => {
    if (!query) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  const isHero = variant === 'hero'
  
  return (
    <div ref={searchRef} className={`relative w-full ${isHero ? 'max-w-2xl' : 'max-w-2xl'}`}>
      <div className="relative">
        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
          isHero ? 'text-white/80' : 'text-gray-400'
        }`}>
          <Search className="h-5 w-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-10 py-3 rounded-lg leading-5 focus:outline-none text-lg ${
            isHero 
              ? 'text-white placeholder-white/80 bg-white/20 border border-white/30 focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm font-bold' 
              : 'border border-gray-300 bg-white placeholder-gray-500 focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          }`}
        />
        {query && (
          <button
            onClick={clearSearch}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
              isHero ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {(isOpen || showSuggestions) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : (
            <div className="py-1">
              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    Suggestions
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center ${
                        index + results.length === selectedIndex ? 'bg-blue-50' : ''
                      }`}
                    >
                      <Search className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        {getHighlightedText(suggestion, query)}
                      </span>
                    </div>
                  ))}
                </>
              )}

              {/* Search Results */}
              {results.length > 0 && (
                <>
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                      Companies
                    </div>
                  )}
                  {results.map((result, index) => (
                    <div
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                        index === selectedIndex ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {result.logoUrl ? (
                          <img
                            src={result.logoUrl}
                            alt={result.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {getHighlightedText(result.name, query)}
                            </h3>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {result.sector}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {getHighlightedText(result.description || '', query)}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                            {result.suburb && result.state && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{result.suburb}, {result.state}</span>
                              </div>
                            )}
                            {result.industry && (
                              <span>{result.industry}</span>
                            )}
                          </div>
                          {result.tags && result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {result.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                                >
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                              {result.tags.length > 3 && (
                                <span className="text-xs text-gray-400">
                                  +{result.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* No results */}
              {!isLoading && results.length === 0 && suggestions.length === 0 && query && (
                <div className="px-4 py-3 text-center text-gray-500">
                  <p>No results found for "{query}"</p>
                  <button
                    onClick={() => {
                      router.push(`/companies?q=${encodeURIComponent(query)}`)
                      setIsOpen(false)
                      setShowSuggestions(false)
                    }}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Try advanced search
                  </button>
                </div>
              )}

              {/* View all results */}
              {(results.length >= 8 || suggestions.length > 0) && (
                <div className="px-4 py-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      router.push(`/companies?q=${encodeURIComponent(query)}`)
                      setIsOpen(false)
                      setShowSuggestions(false)
                    }}
                    className="w-full text-left text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all results for "{query}"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
