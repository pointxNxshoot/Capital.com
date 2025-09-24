# Google Maps Geocoding Setup

## Overview
The application now includes automatic geocoding functionality that converts addresses to latitude/longitude coordinates for Google Maps display.

## Setup Required

### 1. Google Maps API Key
Add your Google Maps API key to your environment variables:

```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 2. Enable Required APIs
In your Google Cloud Console, enable these APIs:
- **Geocoding API** - For converting addresses to coordinates
- **Maps JavaScript API** - For displaying maps

### 3. API Key Restrictions (Recommended)
For security, restrict your API key to:
- **HTTP referrers**: `localhost:3000/*`, `yourdomain.com/*`
- **APIs**: Geocoding API, Maps JavaScript API

## How It Works

### Automatic Geocoding
When users submit a listing:
1. **Address Entry** - User enters street, suburb, state, postcode
2. **Geocoding** - System automatically converts address to coordinates
3. **Map Display** - Google Maps shows the exact location
4. **Visual Feedback** - User sees geocoding status and coordinates

### Fallback Behavior
- If geocoding fails, coordinates remain null
- Maps won't display but listing still saves
- User can manually edit coordinates if needed

## Features Added

### ✅ New Listing Form
- Automatic geocoding on form submission
- Visual indicators during geocoding process
- Success message showing coordinates found

### ✅ Edit Listing Forms
- Geocoding for existing listings without coordinates
- Updates coordinates when address changes

### ✅ Google Maps Integration
- All listings now show maps when coordinates are available
- Interactive markers with company information
- Responsive design for all devices

## Testing

1. **Create a new listing** with a complete address
2. **Check console** for geocoding success messages
3. **View the listing** to see the Google Map
4. **Edit the listing** to verify coordinates are preserved

## Troubleshooting

### Maps Not Showing
- Check if `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- Verify the API key has Geocoding API enabled
- Check browser console for error messages

### Geocoding Fails
- Ensure address is complete (street, suburb, state, postcode)
- Check if the address is valid and exists
- Verify API key has proper permissions

### Performance
- Geocoding happens only once per listing
- Coordinates are cached in the database
- No repeated API calls for existing listings
