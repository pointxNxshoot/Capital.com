import { useState } from 'react'

interface ApiError {
  error: string
  code?: string
  details?: any
}

interface ErrorState {
  message: string
  code?: string
  fieldErrors?: Record<string, string>
  isVisible: boolean
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    message: '',
    code: '',
    fieldErrors: {},
    isVisible: false
  })

  const handleApiError = async (response: Response): Promise<ApiError | null> => {
    let errorData: ApiError | null = null
    
    try {
      // Try to parse as JSON first
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        errorData = await response.json()
      } else {
        // Fallback to text
        const text = await response.text()
        errorData = {
          error: text || `Server error (${response.status})`,
          code: 'SERVER_ERROR'
        }
      }
    } catch (parseError) {
      // If parsing fails, create a generic error
      errorData = {
        error: `Server error (${response.status})`,
        code: 'PARSE_ERROR'
      }
    }

    return errorData
  }

  const showError = (error: ApiError, fieldErrors?: Record<string, string>) => {
    setErrorState({
      message: error.error,
      code: error.code || 'UNKNOWN_ERROR',
      fieldErrors: fieldErrors || {},
      isVisible: true
    })

    // Auto-hide after 10 seconds
    setTimeout(() => {
      setErrorState(prev => ({ ...prev, isVisible: false }))
    }, 10000)
  }

  const clearError = () => {
    setErrorState({
      message: '',
      code: '',
      fieldErrors: {},
      isVisible: false
    })
  }

  const getFieldError = (fieldName: string): string | undefined => {
    return errorState.fieldErrors?.[fieldName]
  }

  return {
    errorState,
    handleApiError,
    showError,
    clearError,
    getFieldError
  }
}
