import { NextRequest, NextResponse } from 'next/server'
import { searchService } from '@/lib/searchService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '5')

    if (!query.trim()) {
      return NextResponse.json({ suggestions: [] })
    }

    const suggestions = await searchService.getAutocompleteSuggestions(query, limit)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Autocomplete API error:', error)
    return NextResponse.json(
      { error: 'Autocomplete failed' },
      { status: 500 }
    )
  }
}
