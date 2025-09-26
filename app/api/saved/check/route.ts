import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/saved/check - Check if a listing is saved by a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const companyId = searchParams.get('companyId')
    
    if (!userId || !companyId) {
      return NextResponse.json({ error: 'User ID and Company ID are required' }, { status: 400 })
    }

    const savedListing = await prisma.savedListing.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId
        }
      }
    })

    return NextResponse.json({ isSaved: !!savedListing })
  } catch (error) {
    console.error('Error checking saved status:', error)
    return NextResponse.json({ error: 'Failed to check saved status' }, { status: 500 })
  }
}
