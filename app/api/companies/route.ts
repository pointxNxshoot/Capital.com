import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { companySchema, searchSchema } from '@/lib/validators'
import { buildSearchWhere, buildSearchOrderBy } from '@/lib/search'

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
    const validatedData = companySchema.parse(body)

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
        tags: JSON.stringify(validatedData.tags), // Store as JSON string for SQLite
        photos: JSON.stringify(validatedData.photos), // Store as JSON string for SQLite
        projectPhotos: JSON.stringify(validatedData.projectPhotos), // Store as JSON string for SQLite
        status: 'pending', // New listings are pending approval
      },
    })

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
