import { searchService } from '../lib/searchService'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function reindexSearch() {
  try {
    console.log('🔄 Reindexing search...')
    
    // Get all companies from database
    const companies = await prisma.company.findMany()
    
    console.log(`Found ${companies.length} companies to index`)
    
    // Clear and reindex each company
    for (const company of companies) {
      try {
        // Remove from index first
        await searchService.removeListing(company.id)
        console.log(`Removed ${company.name} from index`)
      } catch (error) {
        // Ignore if not found
      }
      
      // Add back to index
      await searchService.addListing({
        ...company,
        tags: JSON.parse(company.tags || '[]'),
        photos: JSON.parse(company.photos || '[]'),
        projectPhotos: JSON.parse(company.projectPhotos || '[]')
      })
      console.log(`Added ${company.name} to index`)
    }
    
    console.log('✅ Search reindexing complete!')
  } catch (error) {
    console.error('❌ Error reindexing:', error)
  } finally {
    await prisma.$disconnect()
  }
}

reindexSearch()
