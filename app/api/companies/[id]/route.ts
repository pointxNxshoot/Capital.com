import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

// GET /api/companies/[id] - Get company by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Try to find by slug first, then by ID
    const company = await prisma.company.findFirst({
      where: {
        OR: [
          { slug: id },
          { id: id }
        ]
      }
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }
    
    console.log('Found company:', company.name)
    console.log('Company photos:', company.photos)
    console.log('Company project photos:', company.projectPhotos)

    // Increment view count
    await prisma.company.update({
      where: { id: company.id },
      data: { views: { increment: 1 } },
    })

    // Fields are now Json types, no need to parse
    const companyWithParsedData = {
      ...company,
      tags: company.tags || [],
      photos: company.photos || [],
      projectPhotos: company.projectPhotos || [],
      additionalSections: company.additionalSections || [],
    }
    
    console.log('Returning company with parsed data:')
    console.log('Photos:', companyWithParsedData.photos)
    console.log('Project photos:', companyWithParsedData.projectPhotos)
    console.log('Additional sections:', companyWithParsedData.additionalSections)

    return NextResponse.json({ company: companyWithParsedData })
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    )
  }
}

// PATCH /api/companies/[id] - Update company (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    requireAdmin(request)

    const body = await request.json()
    const { status, ...updateData } = body

    // Validate status if provided
    if (status && !['pending', 'published', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Fields are now Json types, pass arrays directly
    // No need to stringify since Prisma handles Json types

    const company = await prisma.company.update({
      where: { id: id },
      data: {
        ...updateData,
        ...(status && { status }),
      },
    })

    // Fields are now Json types, no need to parse
    const companyWithParsedData = {
      ...company,
      tags: company.tags || [],
      photos: company.photos || [],
      projectPhotos: company.projectPhotos || [],
      additionalSections: company.additionalSections || [],
    }

    return NextResponse.json({ company: companyWithParsedData })
  } catch (error) {
    console.error('Error updating company:', error)
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    )
  }
}
