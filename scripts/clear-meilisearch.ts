import { MeiliSearch } from 'meilisearch'

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_API_KEY || 'masterKey',
})

async function clearMeilisearch() {
  try {
    console.log('🧹 Clearing Meilisearch index...')
    
    // Delete the entire index
    await client.deleteIndex('listings')
    console.log('✅ Deleted listings index')
    
    // Recreate the index
    await client.createIndex('listings', { primaryKey: 'id' })
    console.log('✅ Created new listings index')
    
    // Configure searchable attributes
    await client.index('listings').updateSearchableAttributes([
      'name',
      'description',
      'sector',
      'industry',
      'subIndustry',
      'tags',
      'suburb',
      'state',
      'country'
    ])
    console.log('✅ Configured searchable attributes')
    
    // Configure sortable attributes
    await client.index('listings').updateSortableAttributes([
      'createdAt',
      'views',
      'name'
    ])
    console.log('✅ Configured sortable attributes')
    
    // Configure filterable attributes
    await client.index('listings').updateFilterableAttributes([
      'sector',
      'industry',
      'subIndustry',
      'state',
      'country',
      'status',
      'amountSeeking'
    ])
    console.log('✅ Configured filterable attributes')
    
    console.log('🎉 Meilisearch cleared and reconfigured!')
  } catch (error) {
    console.error('❌ Error clearing Meilisearch:', error)
  }
}

clearMeilisearch()
