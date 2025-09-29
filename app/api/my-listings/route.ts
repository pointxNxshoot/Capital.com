import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { companySchema } from '@/lib/validators'
import { searchService } from '@/lib/searchService'

// GET /api/my-listings - Get user's listings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const createdBy = searchParams.get('createdBy')
    
    if (!createdBy) {
      return NextResponse.json(
        { error: 'createdBy parameter is required' },
        { status: 400 }
      )
    }

    const companies = await prisma.company.findMany({
      where: {
        createdBy: createdBy,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Fields are now Json types, no need to parse
    const companiesWithParsedData = companies.map(company => ({
      ...company,
      tags: company.tags || [],
      photos: company.photos || [],
      projectPhotos: company.projectPhotos || [],
      additionalSections: company.additionalSections || [],
    }))

    return NextResponse.json({ companies: companiesWithParsedData })
  } catch (error) {
    console.error('Error fetching user listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user listings' },
      { status: 500 }
    )
  }
}

// POST /api/my-listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { createdBy, ...companyData } = body
    
    if (!createdBy) {
      return NextResponse.json(
        { error: 'createdBy is required' },
        { status: 400 }
      )
    }

    // Validate the company data
    const validatedData = companySchema.parse(companyData)
    
    // Generate slug from name
    const base = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const slug = base || `company-${Date.now()}`

    // Create the company
    console.log('Creating company in database:', validatedData.name, 'Owner:', createdBy)
    const company = await prisma.company.create({
      data: {
        ...validatedData,
        slug,
        createdBy,
        tags: validatedData.tags, // Pass as array directly
        photos: validatedData.photos, // Pass as array directly
        projectPhotos: validatedData.projectPhotos, // Pass as array directly
        additionalSections: validatedData.additionalSections, // Pass as array directly
        status: 'pending',
      },
    })
    console.log('Successfully created company in database:', company.id)

    // Add to Meilisearch index
    try {
      await searchService.addListing({
        ...company,
        tags: validatedData.tags,
        photos: validatedData.photos,
        projectPhotos: validatedData.projectPhotos,
      })
      console.log('Successfully added listing to search index:', company.id)
    } catch (error) {
      console.error('Error adding listing to search index:', error)
      // Don't fail the request if search indexing fails
    }

    return NextResponse.json({
      company: {
        ...company,
        tags: company.tags, // Already an array
        photos: company.photos, // Already an array
        projectPhotos: company.projectPhotos, // Already an array
        additionalSections: company.additionalSections, // Already an array
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating listing:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    )
  }
}
