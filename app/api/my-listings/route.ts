import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { companySchema } from '@/lib/validators'

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

    // Parse JSON fields
    const companiesWithParsedData = companies.map(company => ({
      ...company,
      tags: JSON.parse(company.tags),
      photos: JSON.parse(company.photos),
      projectPhotos: JSON.parse(company.projectPhotos),
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
    const company = await prisma.company.create({
      data: {
        ...validatedData,
        slug,
        createdBy,
        tags: JSON.stringify(validatedData.tags),
        photos: JSON.stringify(validatedData.photos),
        projectPhotos: JSON.stringify(validatedData.projectPhotos),
        status: 'pending',
      },
    })

    return NextResponse.json({
      company: {
        ...company,
        tags: validatedData.tags,
        photos: validatedData.photos,
        projectPhotos: validatedData.projectPhotos,
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
