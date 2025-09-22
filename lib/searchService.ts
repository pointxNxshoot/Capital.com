import { MeiliSearch } from 'meilisearch'

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://127.0.0.1:7700',
  apiKey: process.env.MEILISEARCH_API_KEY || 'masterKey', // Change this in production
})

const INDEX_NAME = 'listings'

export const searchService = {
  // Initialize the search index
  async initializeIndex() {
    try {
      const index = client.index(INDEX_NAME)
      
      // Configure searchable attributes
      await index.updateSearchableAttributes([
        'name',
        'description', 
        'sector',
        'industry',
        'subIndustry',
        'suburb',
        'state',
        'tags'
      ])
      
      // Configure sortable attributes
      await index.updateSortableAttributes([
        'createdAt',
        'views',
        'name'
      ])
      
      // Configure filterable attributes
      await index.updateFilterableAttributes([
        'sector',
        'industry',
        'state',
        'status',
        'amountSeeking'
      ])
      
      console.log('Search index initialized successfully')
    } catch (error) {
      console.error('Error initializing search index:', error)
    }
  },

  // Add or update a listing in the search index
  async addListing(listing: any) {
    try {
      const index = client.index(INDEX_NAME)
      
      // Transform the listing data for search
      const searchDoc = {
        id: listing.id,
        name: listing.name,
        description: listing.description || '',
        sector: listing.sector,
        industry: listing.industry,
        subIndustry: listing.subIndustry || '',
        suburb: listing.suburb || '',
        state: listing.state || '',
        latitude: listing.latitude,
        longitude: listing.longitude,
        tags: Array.isArray(listing.tags) ? listing.tags : JSON.parse(listing.tags || '[]'),
        status: listing.status,
        amountSeeking: listing.amountSeeking || '',
        views: listing.views || 0,
        createdAt: listing.createdAt,
        slug: listing.slug,
        logoUrl: listing.logoUrl || '',
        photos: Array.isArray(listing.photos) ? listing.photos : JSON.parse(listing.photos || '[]')
      }
      
      await index.addDocuments([searchDoc])
      console.log(`Added listing ${listing.id} to search index`)
    } catch (error) {
      console.error('Error adding listing to search index:', error)
    }
  },

  // Remove a listing from the search index
  async removeListing(listingId: string) {
    try {
      const index = client.index(INDEX_NAME)
      await index.deleteDocument(listingId)
      console.log(`Removed listing ${listingId} from search index`)
    } catch (error) {
      console.error('Error removing listing from search index:', error)
    }
  },

  // Search listings
  async searchListings(query: string, options: {
    limit?: number
    offset?: number
    filters?: string
    sort?: string[]
  } = {}) {
    try {
      const index = client.index(INDEX_NAME)
      
      const searchParams = {
        q: query,
        limit: options.limit || 20,
        offset: options.offset || 0,
        attributesToRetrieve: [
          'id', 'name', 'description', 'sector', 'industry', 
          'suburb', 'state', 'latitude', 'longitude', 'tags', 
          'status', 'amountSeeking', 'views', 'createdAt', 
          'slug', 'logoUrl', 'photos'
        ],
        ...(options.filters && { filter: options.filters }),
        ...(options.sort && { sort: options.sort })
      }
      
      const results = await index.search(query, searchParams)
      return results
    } catch (error) {
      console.error('Error searching listings:', error)
      return { hits: [], totalHits: 0, offset: 0, limit: 0 }
    }
  },

  // Get autocomplete suggestions
  async getAutocompleteSuggestions(query: string, limit: number = 5) {
    try {
      const index = client.index(INDEX_NAME)
      
      const searchParams = {
        q: query,
        limit: limit,
        attributesToRetrieve: ['name', 'sector', 'industry', 'suburb', 'state'],
        attributesToHighlight: ['name', 'sector', 'industry'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>'
      }
      
      const results = await index.search(query, searchParams)
      
      // Extract unique suggestions from different fields
      const suggestions = new Set<string>()
      
      results.hits.forEach((hit: any) => {
        // Add company name suggestions
        if (hit.name && hit.name.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(hit.name)
        }
        
        // Add sector suggestions
        if (hit.sector && hit.sector.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(hit.sector)
        }
        
        // Add industry suggestions
        if (hit.industry && hit.industry.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(hit.industry)
        }
        
        // Add location suggestions
        if (hit.suburb && hit.suburb.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(`${hit.suburb}, ${hit.state}`)
        }
      })
      
      return Array.from(suggestions).slice(0, limit)
    } catch (error) {
      console.error('Error getting autocomplete suggestions:', error)
      return []
    }
  },

  // Sync all listings from database to search index
  async syncAllListings() {
    try {
      const { prisma } = await import('@/lib/db')
      
      const listings = await prisma.company.findMany({
        where: { status: 'published' }
      })
      
      const searchDocs = listings.map(listing => ({
        id: listing.id,
        name: listing.name,
        description: listing.description || '',
        sector: listing.sector,
        industry: listing.industry,
        subIndustry: listing.subIndustry || '',
        suburb: listing.suburb || '',
        state: listing.state || '',
        latitude: listing.latitude,
        longitude: listing.longitude,
        tags: Array.isArray(listing.tags) ? listing.tags : JSON.parse(listing.tags || '[]'),
        status: listing.status,
        amountSeeking: listing.amountSeeking || '',
        views: listing.views || 0,
        createdAt: listing.createdAt,
        slug: listing.slug,
        logoUrl: listing.logoUrl || '',
        photos: Array.isArray(listing.photos) ? listing.photos : JSON.parse(listing.photos || '[]')
      }))
      
      const index = client.index(INDEX_NAME)
      await index.addDocuments(searchDocs)
      
      console.log(`Synced ${listings.length} listings to search index`)
    } catch (error) {
      console.error('Error syncing listings to search index:', error)
    }
  }
}
