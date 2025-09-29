// Utility functions for payload validation and sanitization
export function sanitizePayload(data: any): any {
  if (data === null || data === undefined) {
    return data
  }

  if (Array.isArray(data)) {
    return data.map(sanitizePayload).filter(item => item !== undefined)
  }

  if (typeof data === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(data)) {
      // Skip undefined values unless explicitly allowed
      if (value === undefined) {
        continue
      }
      
      // Skip File/Blob objects - these should be uploaded separately
      if (value instanceof File || value instanceof Blob) {
        console.warn(`Skipping File/Blob object for key: ${key}`)
        continue
      }
      
      // Handle accidental stringified JSON for array fields
      if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
        try {
          const parsed = JSON.parse(value)
          sanitized[key] = sanitizePayload(parsed)
          continue
        } catch {
          // If parsing fails, keep as string
        }
      }
      
      // Recursively sanitize nested objects
      const sanitizedValue = sanitizePayload(value)
      if (sanitizedValue !== undefined) {
        sanitized[key] = sanitizedValue
      }
    }
    return sanitized
  }

  return data
}

export function validateAdditionalSections(sections: any[]): any[] {
  if (!Array.isArray(sections)) {
    return []
  }

  return sections.map(section => {
    if (!section || typeof section !== 'object') {
      return null
    }

    return {
      id: typeof section.id === 'string' ? section.id : '',
      title: typeof section.title === 'string' ? section.title : '',
      description: typeof section.description === 'string' ? section.description : '',
      imageUrls: Array.isArray(section.imageUrls) 
        ? section.imageUrls.filter(url => typeof url === 'string' && url.length > 0)
        : [],
      fileUrls: Array.isArray(section.fileUrls) 
        ? section.fileUrls.filter(url => typeof url === 'string' && url.length > 0)
        : [],
      deck: section.deck && typeof section.deck === 'object' 
        ? {
            type: section.deck.type === 'pdf' || section.deck.type === 'link' ? section.deck.type : null,
            url: typeof section.deck.url === 'string' ? section.deck.url : null
          }
        : null,
      tags: Array.isArray(section.tags) 
        ? section.tags.filter(tag => typeof tag === 'string' && tag.length > 0)
        : [],
      order: typeof section.order === 'number' ? section.order : 0,
      visibility: section.visibility === 'public' || section.visibility === 'requestAccess' 
        ? section.visibility 
        : 'public'
    }
  }).filter(section => section !== null)
}

export function convertNumericFields(data: any): any {
  const numericFields = ['latitude', 'longitude', 'price']
  
  if (typeof data === 'object' && data !== null) {
    const converted = { ...data }
    
    for (const field of numericFields) {
      if (converted[field] !== undefined && converted[field] !== null) {
        const num = Number(converted[field])
        if (!isNaN(num)) {
          converted[field] = num
        }
      }
    }
    
    return converted
  }
  
  return data
}

export function logResponseDetails(response: Response, isDev: boolean = false) {
  if (!isDev) return
  
  console.group('🔍 Response Details')
  console.log('Status:', response.status)
  console.log('Status Text:', response.statusText)
  console.log('Headers:', Object.fromEntries(response.headers.entries()))
  console.groupEnd()
}
