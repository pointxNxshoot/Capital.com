import { searchService } from '../lib/searchService'

async function testSearch() {
  try {
    console.log('🔍 Testing Meilisearch...')
    
    // Test search with empty query
    const results = await searchService.searchListings('', {
      limit: 20,
      offset: 0
    })
    
    console.log('Search results:', {
      totalHits: results.totalHits,
      hitsCount: results.hits?.length || 0,
      hits: results.hits?.map((hit: any) => ({ id: hit.id, name: hit.name })) || []
    })
    
  } catch (error) {
    console.error('❌ Search test error:', error)
  }
}

testSearch()
