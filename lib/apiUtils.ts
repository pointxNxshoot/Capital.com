// Utility functions for API calls with retry logic

export async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      if (response.ok) {
        return response
      }
      
      // If it's the last retry, return the response even if it's not ok
      if (i === retries - 1) {
        return response
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    } catch (error) {
      console.error(`API call failed (attempt ${i + 1}/${retries}):`, error)
      
      // If it's the last retry, throw the error
      if (i === retries - 1) {
        throw error
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  
  throw new Error('All retry attempts failed')
}

export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch('/api/health', { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}
