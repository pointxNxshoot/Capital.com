import { NextRequest, NextResponse } from 'next/server'
import { searchService } from '@/lib/searchService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const filters = searchParams.get('filters') || undefined
    const sort = searchParams.get('sort') ? searchParams.get('sort')!.split(',') : undefined

    if (!query.trim()) {
      return NextResponse.json({ hits: [], totalHits: 0, offset: 0, limit: 0 })
    }

    const results = await searchService.searchListings(query, {
      limit,
      offset,
      filters,
      sort
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
