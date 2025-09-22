import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { advisorSchema } from '@/lib/validators'

// POST /api/advisors - Create a new advisor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = advisorSchema.parse(body)

    const advisor = await prisma.advisor.create({
      data: {
        ...validatedData,
        specialties: JSON.stringify(validatedData.specialties), // Store as JSON string for SQLite
      },
    })

    return NextResponse.json(
      { 
        advisor: {
          ...advisor,
          specialties: validatedData.specialties, // Return parsed specialties
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating advisor:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create advisor' },
      { status: 500 }
    )
  }
}

// GET /api/advisors - List advisors
export async function GET(request: NextRequest) {
  try {
    const advisors = await prisma.advisor.findMany({
      where: {
        status: 'active'
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        firmName: true,
        teamLead: true,
        headshotUrl: true,
        email: true,
        phone: true,
        suburb: true,
        state: true,
        websiteUrl: true,
        description: true,
        specialties: true,
        createdAt: true,
      }
    })

    // Parse specialties from JSON strings
    const advisorsWithParsedSpecialties = advisors.map(advisor => ({
      ...advisor,
      specialties: JSON.parse(advisor.specialties || '[]'),
    }))

    return NextResponse.json({
      advisors: advisorsWithParsedSpecialties
    })
  } catch (error) {
    console.error('Error fetching advisors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch advisors' },
      { status: 500 }
    )
  }
}