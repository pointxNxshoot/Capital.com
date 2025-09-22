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

    // Increment view count
    await prisma.company.update({
      where: { id: company.id },
      data: { views: { increment: 1 } },
    })

    // Parse tags and photos from JSON string
    const companyWithParsedData = {
      ...company,
      tags: JSON.parse(company.tags || '[]'),
      photos: JSON.parse(company.photos || '[]'),
      projectPhotos: JSON.parse(company.projectPhotos || '[]'),
    }

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

    // Parse tags and photos if provided
    if (updateData.tags) {
      updateData.tags = JSON.stringify(updateData.tags)
    }
    if (updateData.photos) {
      updateData.photos = JSON.stringify(updateData.photos)
    }
    if (updateData.projectPhotos) {
      updateData.projectPhotos = JSON.stringify(updateData.projectPhotos)
    }

    const company = await prisma.company.update({
      where: { id: id },
      data: {
        ...updateData,
        ...(status && { status }),
      },
    })

    // Parse tags and photos from JSON string
    const companyWithParsedData = {
      ...company,
      tags: JSON.parse(company.tags || '[]'),
      photos: JSON.parse(company.photos || '[]'),
      projectPhotos: JSON.parse(company.projectPhotos || '[]'),
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
