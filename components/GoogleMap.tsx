'use client'

import ListingMap from './ListingMap'

interface GoogleMapProps {
  latitude: number
  longitude: number
  companyName: string
  address?: string
  className?: string
}

export default function GoogleMap({ 
  latitude, 
  longitude, 
  companyName, 
  address,
  className = "w-full h-64 rounded-lg"
}: GoogleMapProps) {
  // Check if we have a valid API key
  const hasApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && 
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE'

  if (!hasApiKey) {
    // Show placeholder if no API key is configured
    return (
      <div className={className}>
        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🗺️</div>
            <div className="font-medium">Map View</div>
            <div className="text-sm">{companyName}</div>
            {address && <div className="text-sm">{address}</div>}
            <div className="text-xs mt-2">Google Maps integration requires API key</div>
            <div className="text-xs mt-1">
              Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ListingMap
      lat={latitude}
      lng={longitude}
      companyName={companyName}
      address={address}
      className={className}
      height={256} // Convert h-64 (16rem) to pixels
      zoom={15}
    />
  )
}
