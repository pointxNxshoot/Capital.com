import { searchService } from '../lib/searchService'

async function syncSearchIndex() {
  try {
    console.log('Initializing search index...')
    await searchService.initializeIndex()
    
    console.log('Syncing all listings to search index...')
    await searchService.syncAllListings()
    
    console.log('Search index sync completed successfully!')
  } catch (error) {
    console.error('Error syncing search index:', error)
    process.exit(1)
  }
}

syncSearchIndex()
