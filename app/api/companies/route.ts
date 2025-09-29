import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { companySchema, searchSchema } from '@/lib/validators'
import { buildSearchWhere, buildSearchOrderBy, searchListings } from '@/lib/search'
import { searchService } from '@/lib/searchService'

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
          additionalSections: true,
          views: true,
          createdAt: true,
        },
      }),
      prisma.company.count({ where }),
    ])

    // Fields are now Json types, no need to parse
    const companiesWithParsedData = companies.map(company => ({
      ...company,
      tags: company.tags || [],
      photos: company.photos || [],
      projectPhotos: company.projectPhotos || [],
      additionalSections: company.additionalSections || [],
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

    const company = await prisma.company.create({
      data: {
        ...validatedData,
        slug: finalSlug,
        tags: validatedData.tags, // Pass as array directly
        photos: validatedData.photos, // Pass as array directly
        projectPhotos: validatedData.projectPhotos, // Pass as array directly
        additionalSections: validatedData.additionalSections, // Pass as array directly
        status: 'pending', // New listings are pending approval
        createdBy: validatedData.createdBy || 'anonymous', // Track who created the listing
      },
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
          tags: company.tags, // Already an array
          photos: company.photos, // Already an array
          projectPhotos: company.projectPhotos, // Already an array
          additionalSections: company.additionalSections, // Already an array
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating company:', error)
    
    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      const zodError = error as any
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          code: 'VALIDATION_ERROR',
          details: zodError.flatten?.() || zodError.message 
        },
        { status: 422 }
      )
    }
    
    // Handle Prisma errors
    if (error instanceof Error && error.message.includes('PrismaClientInitializationError')) {
      return NextResponse.json(
        { 
          error: 'Database connection failed', 
          code: 'DATABASE_ERROR',
          details: 'Unable to connect to the database. Please try again later.'
        },
        { status: 500 }
      )
    }
    
    // Handle other known errors
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: error.message || 'Failed to create company listing', 
          code: 'SERVER_ERROR',
          details: 'An unexpected error occurred. Please try again.'
        },
        { status: 500 }
      )
    }
    
    // Fallback for unknown errors
    return NextResponse.json(
      { 
        error: 'Failed to create company listing', 
        code: 'UNKNOWN_ERROR',
        details: 'An unexpected error occurred. Please try again.'
      },
      { status: 500 }
    )
  }
}
