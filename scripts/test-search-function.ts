import { searchListings } from '../lib/search'

async function testSearchFunction() {
  try {
    console.log('🔍 Testing search function...')
    
    const results = await searchListings({
      q: '',
      sector: undefined,
      state: undefined,
      tags: undefined,
      sort: 'relevance',
      page: 1,
      limit: 20
    })
    
    console.log('Search function results:', {
      companies: results?.companies?.length || 0,
      total: results?.total || 0,
      page: results?.page || 0,
      limit: results?.limit || 0,
      totalPages: results?.totalPages || 0
    })
    
    if (results?.companies) {
      console.log('Companies found:')
      results.companies.forEach((company: any, index: number) => {
        console.log(`${index + 1}. ${company.name} (${company.id})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Search function test error:', error)
  }
}

testSearchFunction()
