import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { companySchema, searchSchema } from '@/lib/validators'
import { buildSearchWhere, buildSearchOrderBy, searchListings } from '@/lib/search'
import { searchService } from '@/lib/searchService'
import { prepareCompanyData } from '@/lib/prismaUtils'

// GET /api/companies - Search and list companies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = {
      q: searchParams.get('q') || undefined,
      sector: searchParams.get('sector') || undefined,
      state: searchParams.get('state') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      sort: searchParams.get('sort') || 'relevance',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    }

    const validatedParams = searchSchema.parse(params)

    // Try Meilisearch first, fallback to database search
    const meilisearchResults = await searchListings(validatedParams)
    
    if (meilisearchResults) {
      return NextResponse.json({
        companies: meilisearchResults.companies,
        pagination: {
          page: meilisearchResults.page,
          limit: meilisearchResults.limit,
          total: meilisearchResults.total,
          totalPages: meilisearchResults.totalPages,
        },
      })
    }

    // Fallback to database search
    const where = buildSearchWhere(validatedParams)
    const orderBy = buildSearchOrderBy(validatedParams)

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        orderBy,
        skip: (validatedParams.page - 1) * validatedParams.limit,
        take: validatedParams.limit,
        select: {
          id: true,
          name: true,
          slug: true,
          sector: true,
          industry: true,
          description: true,
          logoUrl: true,
          websiteUrl: true,
          suburb: true,
          state: true,
          latitude: true,
          longitude: true,
          tags: true,
          photos: true,
          projectPhotos: true,
          views: true,
          createdAt: true,
        },
      }),
      prisma.company.count({ where }),
    ])

    // Parse tags and photos from JSON strings
    const companiesWithParsedData = companies.map(company => ({
      ...company,
      tags: JSON.parse(company.tags || '[]'),
      photos: JSON.parse(company.photos || '[]'),
      projectPhotos: JSON.parse(company.projectPhotos || '[]'),
    }))

    return NextResponse.json({
      companies: companiesWithParsedData,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        total,
        totalPages: Math.ceil(total / validatedParams.limit),
      },
    })
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}

// POST /api/companies - Create a new company listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Company creation request body:', body)
    const validatedData = companySchema.parse(body)
    console.log('Validated data:', validatedData)
    console.log('Photos data:', validatedData.photos)
    console.log('Project photos data:', validatedData.projectPhotos)

    // Generate slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingCompany = await prisma.company.findUnique({
      where: { slug },
    })

    let finalSlug = slug
    if (existingCompany) {
      let counter = 1
      while (await prisma.company.findUnique({ where: { slug: `${slug}-${counter}` } })) {
        counter++
      }
      finalSlug = `${slug}-${counter}`
    }

    // Prepare data for Prisma using utility function
    const companyData = prepareCompanyData(validatedData, {
      slug: finalSlug,
      status: 'pending', // New listings are pending approval
      createdBy: validatedData.createdBy || 'anonymous', // Track who created the listing
    })

    const company = await prisma.company.create({
      data: companyData,
    })

    // Add to Meilisearch index (both pending and published)
    try {
      console.log('Adding listing to search index:', company.name, 'Status:', company.status)
      await searchService.addListing({
        ...company,
        tags: validatedData.tags,
        photos: validatedData.photos,
        projectPhotos: validatedData.projectPhotos,
      })
      console.log('Successfully added listing to search index')
    } catch (error) {
      console.error('Error adding listing to search index:', error)
      // Don't fail the request if search indexing fails
    }

    return NextResponse.json(
      { 
        company: {
          ...company,
          tags: validatedData.tags, // Return parsed tags
          photos: validatedData.photos, // Return parsed photos
          projectPhotos: validatedData.projectPhotos, // Return parsed project photos
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating company:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create company listing' },
      { status: 500 }
    )
  }
}
