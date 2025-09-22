'use client'

import { useEffect, useRef } from 'react'

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
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Create a simple map using Google Maps Embed API
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${latitude},${longitude}&zoom=15`
    
    // For now, we'll use a placeholder since we don't have a Google Maps API key
    // In production, you would need to get a Google Maps API key
    const placeholderMap = document.createElement('div')
    placeholderMap.className = 'w-full h-full bg-gray-200 rounded-lg flex items-center justify-center'
    placeholderMap.innerHTML = `
      <div class="text-center text-gray-500">
        <div class="text-4xl mb-2">🗺️</div>
        <div class="font-medium">Map View</div>
        <div class="text-sm">${companyName}</div>
        ${address ? `<div class="text-sm">${address}</div>` : ''}
        <div class="text-xs mt-2">Google Maps integration requires API key</div>
      </div>
    `
    
    mapRef.current.appendChild(placeholderMap)

    // In production, you would use this instead:
    // const iframe = document.createElement('iframe')
    // iframe.src = mapUrl
    // iframe.className = 'w-full h-full border-0 rounded-lg'
    // iframe.allowFullScreen = true
    // iframe.loading = 'lazy'
    // iframe.referrerPolicy = 'no-referrer-when-downgrade'
    // mapRef.current.appendChild(iframe)

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = ''
      }
    }
  }, [latitude, longitude, companyName, address])

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
