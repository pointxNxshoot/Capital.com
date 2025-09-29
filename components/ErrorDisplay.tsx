'use client'

import { useState } from 'react'
import { X, AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorDisplayProps {
  message: string
  code?: string
  fieldErrors?: Record<string, string>
  isVisible: boolean
  onDismiss: () => void
  onRetry?: () => void
}

export default function ErrorDisplay({ 
  message, 
  code, 
  fieldErrors, 
  isVisible, 
  onDismiss, 
  onRetry 
}: ErrorDisplayProps) {
  if (!isVisible) return null

  const hasFieldErrors = fieldErrors && Object.keys(fieldErrors).length > 0

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            {message}
          </h3>
          
          {code && (
            <p className="text-xs text-red-600 mb-2">
              Error Code: {code}
            </p>
          )}

          {hasFieldErrors && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-red-800 mb-2">
                Please fix the following issues:
              </h4>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {Object.entries(fieldErrors).map(([field, error]) => (
                  <li key={field}>
                    <strong>{field}:</strong> {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-2 mt-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Try Again
              </button>
            )}
            <button
              onClick={onDismiss}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
        
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 ml-2"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
