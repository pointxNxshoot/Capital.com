// Geocoding utility to convert addresses to coordinates
export interface GeocodingResult {
  latitude: number
  longitude: number
  formattedAddress: string
}

export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  try {
    // Check if we have a Google Maps API key
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
      console.warn('Google Maps API key not configured, skipping geocoding')
      return null
    }

    // Construct the full address
    const fullAddress = address.trim()
    if (!fullAddress) {
      return null
    }

    // Use Google Geocoding API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0]
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address
      }
    } else {
      console.warn('Geocoding failed:', data.status, data.error_message)
      return null
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

// Client-side geocoding function for use in forms
export async function geocodeAddressClient(address: string): Promise<GeocodingResult | null> {
  try {
    // Check if we have a Google Maps API key
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
      console.warn('Google Maps API key not configured, skipping geocoding')
      return null
    }

    // Construct the full address
    const fullAddress = address.trim()
    if (!fullAddress) {
      return null
    }

    // Use Google Geocoding API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0]
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address
      }
    } else {
      console.warn('Geocoding failed:', data.status, data.error_message)
      return null
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}
