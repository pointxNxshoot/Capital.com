import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { companySchema } from '@/lib/validators'

// GET /api/my-listings/[id] - Get a specific user listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { searchParams } = new URL(request.url)
    const createdBy = searchParams.get('createdBy')
    
    if (!createdBy) {
      return NextResponse.json(
        { error: 'createdBy parameter is required' },
        { status: 400 }
      )
    }

    const company = await prisma.company.findFirst({
      where: {
        id: resolvedParams.id,
        createdBy: createdBy,
      },
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found or not owned by user' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const companyWithParsedData = {
      ...company,
      tags: JSON.parse(company.tags),
      photos: JSON.parse(company.photos),
      projectPhotos: JSON.parse(company.projectPhotos),
    }

    return NextResponse.json({ company: companyWithParsedData })
  } catch (error) {
    console.error('Error fetching user listing:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user listing' },
      { status: 500 }
    )
  }
}

// PUT /api/my-listings/[id] - Update a user listing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const { createdBy, ...updateData } = body
    
    if (!createdBy) {
      return NextResponse.json(
        { error: 'createdBy is required' },
        { status: 400 }
      )
    }

    // Validate the update data
    const validatedData = companySchema.parse(updateData)
    console.log('Validated data:', validatedData)

    // Check if the company exists and is owned by the user
    const existingCompany = await prisma.company.findFirst({
      where: {
        id: resolvedParams.id,
        createdBy: createdBy,
      },
    })

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found or not owned by user' },
        { status: 404 }
      )
    }

    // Update the company
    const updatedCompany = await prisma.company.update({
      where: { id: resolvedParams.id },
      data: {
        ...validatedData,
        tags: JSON.stringify(validatedData.tags),
        photos: JSON.stringify(validatedData.photos),
        projectPhotos: JSON.stringify(validatedData.projectPhotos),
        status: 'pending', // Reset to pending when edited
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      company: {
        ...updatedCompany,
        tags: validatedData.tags,
        photos: validatedData.photos,
        projectPhotos: validatedData.projectPhotos,
      }
    })
  } catch (error) {
    console.error('Error updating user listing:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update user listing' },
      { status: 500 }
    )
  }
}

// DELETE /api/my-listings/[id] - Delete a user listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { searchParams } = new URL(request.url)
    const createdBy = searchParams.get('createdBy')
    
    if (!createdBy) {
      return NextResponse.json(
        { error: 'createdBy parameter is required' },
        { status: 400 }
      )
    }

    // Check if the company exists and is owned by the user
    const existingCompany = await prisma.company.findFirst({
      where: {
        id: resolvedParams.id,
        createdBy: createdBy,
      },
    })

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found or not owned by user' },
        { status: 404 }
      )
    }

    // Delete the company
    await prisma.company.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user listing:', error)
    return NextResponse.json(
      { error: 'Failed to delete user listing' },
      { status: 500 }
    )
  }
}
