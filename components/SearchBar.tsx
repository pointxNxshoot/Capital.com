'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export default function SearchBar({ 
  placeholder = "Search companies...", 
  className = "" 
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const debouncedQuery = useDebounce(query, 300)

  // Mock suggestions - in real app, this would fetch from API
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSuggestions([
        `${debouncedQuery} - Technology`,
        `${debouncedQuery} - Healthcare`,
        `${debouncedQuery} - Finance`,
      ])
      setIsLoading(false)
    }, 200)
  }, [debouncedQuery])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/companies?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
    }
  }, [query, router])

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion)
    router.push(`/companies?q=${encodeURIComponent(suggestion)}`)
    setIsOpen(false)
  }, [router])

  const handleClear = useCallback(() => {
    setQuery('')
    setSuggestions([])
    inputRef.current?.focus()
  }, [])

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/80" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 text-lg font-bold text-white placeholder-white/80 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none backdrop-blur-sm"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">Searching...</div>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                {suggestion}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
