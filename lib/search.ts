import { Prisma } from '@prisma/client'
import { SearchParams } from './validators'
import { searchService } from './searchService'

// Fallback to database search if Meilisearch is not available
export function buildSearchWhere(params: SearchParams): Prisma.CompanyWhereInput {
  const where: Prisma.CompanyWhereInput = {
    // Show both pending and published companies
    status: {
      in: ['pending', 'published']
    }
  }

  // Text search
  if (params.q) {
    where.AND = [
      {
        OR: [
          { name: { contains: params.q } },
          { description: { contains: params.q } },
          { sector: { contains: params.q } },
          { industry: { contains: params.q } },
          { suburb: { contains: params.q } },
          { state: { contains: params.q } },
        ]
      }
    ]
  }

  // Sector filter
  if (params.sector) {
    where.sector = params.sector
  }

  // State filter
  if (params.state) {
    where.state = params.state
  }

  // Tags filter
  if (params.tags && params.tags.length > 0) {
    where.tags = {
      contains: JSON.stringify(params.tags),
    }
  }

  return where
}

export function buildSearchOrderBy(params: SearchParams): Prisma.CompanyOrderByWithRelationInput[] {
  switch (params.sort) {
    case 'name':
      return [{ name: 'asc' }]
    case 'views':
      return [{ views: 'desc' }]
    case 'relevance':
    default:
      return [{ views: 'desc' }, { createdAt: 'desc' }]
  }
}

// New Meilisearch-powered search function
export async function searchListings(params: SearchParams) {
  try {
    // Build filters for Meilisearch
    const filters: string[] = []
    
    if (params.sector) {
      filters.push(`sector = "${params.sector}"`)
    }
    
    if (params.state) {
      filters.push(`state = "${params.state}"`)
    }
    
    if (params.tags && params.tags.length > 0) {
      const tagFilters = params.tags.map(tag => `tags = "${tag}"`).join(' OR ')
      filters.push(`(${tagFilters})`)
    }

    // Include both pending and published listings
    filters.push(`status = "pending" OR status = "published"`)

    // Build sort array for Meilisearch
    const sort: string[] = []
    switch (params.sort) {
      case 'name':
        sort.push('name:asc')
        break
      case 'views':
        sort.push('views:desc')
        break
      case 'relevance':
      default:
        sort.push('views:desc', 'createdAt:desc')
        break
    }

    const results = await searchService.searchListings(params.q || '', {
      limit: params.limit || 20,
      offset: ((params.page || 1) - 1) * (params.limit || 20),
      filters: filters.length > 0 ? filters.join(' AND ') : undefined,
      sort: sort.length > 0 ? sort : undefined
    })

    console.log('Meilisearch results:', {
      totalHits: results.totalHits,
      hitsCount: results.hits?.length || 0,
      filters: filters.length > 0 ? filters.join(' AND ') : 'none'
    })

    return {
      companies: results.hits,
      total: results.totalHits,
      page: params.page || 1,
      limit: params.limit || 20,
      totalPages: Math.ceil(results.totalHits / (params.limit || 20))
    }
  } catch (error) {
    console.error('Meilisearch error, falling back to database search:', error)
    // Fallback to database search if Meilisearch fails
    return null
  }
}
