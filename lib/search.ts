import { Prisma } from '@prisma/client'
import { SearchParams } from './validators'

export function buildSearchWhere(params: SearchParams): Prisma.CompanyWhereInput {
  const where: Prisma.CompanyWhereInput = {
    // Show all companies for now (no status filter)
  }

  // Text search
  if (params.q) {
    where.AND = [
      {
        OR: [
          { name: { contains: params.q, mode: 'insensitive' } },
          { description: { contains: params.q, mode: 'insensitive' } },
          { sector: { contains: params.q, mode: 'insensitive' } },
          { industry: { contains: params.q, mode: 'insensitive' } },
          { suburb: { contains: params.q, mode: 'insensitive' } },
          { state: { contains: params.q, mode: 'insensitive' } },
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
