import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Force this route to use Node.js runtime
export const runtime = 'nodejs'

// Maximum file size: 15MB
const MAX_FILE_SIZE = 15 * 1024 * 1024

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 15MB.' },
        { status: 413 }
      )
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const filename = `${timestamp}-${randomString}.${fileExtension}`
    const filepath = join(uploadsDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return the public URL
    const url = `/uploads/${filename}`

    return NextResponse.json({ url })

  } catch (error) {
    console.error('Upload error:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('ENOSPC')) {
        return NextResponse.json(
          { error: 'Insufficient storage space' },
          { status: 507 }
        )
      }
      if (error.message.includes('EACCES')) {
        return NextResponse.json(
          { error: 'Permission denied' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}
