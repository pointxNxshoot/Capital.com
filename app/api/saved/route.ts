import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/saved - Get all saved listings for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const savedListings = await prisma.savedListing.findMany({
      where: { userId },
      include: {
        company: {
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
            views: true,
            amountSeeking: true,
            photos: true,
            projectPhotos: true,
            latitude: true,
            longitude: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ savedListings })
  } catch (error) {
    console.error('Error fetching saved listings:', error)
    return NextResponse.json({ error: 'Failed to fetch saved listings' }, { status: 500 })
  }
}

// POST /api/saved - Save a listing
export async function POST(request: NextRequest) {
  try {
    const { userId, companyId } = await request.json()
    
    if (!userId || !companyId) {
      return NextResponse.json({ error: 'User ID and Company ID are required' }, { status: 400 })
    }

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Check if already saved
    const existingSaved = await prisma.savedListing.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId
        }
      }
    })

    if (existingSaved) {
      return NextResponse.json({ error: 'Company already saved' }, { status: 409 })
    }

    // Save the listing
    const savedListing = await prisma.savedListing.create({
      data: {
        userId,
        companyId
      },
      include: {
        company: {
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
            views: true,
            amountSeeking: true,
            photos: true,
            projectPhotos: true,
            latitude: true,
            longitude: true,
            createdAt: true
          }
        }
      }
    })

    return NextResponse.json({ savedListing })
  } catch (error) {
    console.error('Error saving listing:', error)
    return NextResponse.json({ error: 'Failed to save listing' }, { status: 500 })
  }
}

// DELETE /api/saved - Unsave a listing
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const companyId = searchParams.get('companyId')
    
    if (!userId || !companyId) {
      return NextResponse.json({ error: 'User ID and Company ID are required' }, { status: 400 })
    }

    const deletedSaved = await prisma.savedListing.deleteMany({
      where: {
        userId,
        companyId
      }
    })

    // Return success regardless of whether the listing was found or not
    // If it wasn't found, it means it was already unsaved, which is the desired state
    return NextResponse.json({ 
      message: deletedSaved.count > 0 
        ? 'Listing unsaved successfully' 
        : 'Listing was already unsaved' 
    })
  } catch (error) {
    console.error('Error unsaving listing:', error)
    return NextResponse.json({ error: 'Failed to unsave listing' }, { status: 500 })
  }
}
