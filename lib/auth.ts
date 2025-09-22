import { NextRequest } from 'next/server'

export function isAdmin(request: NextRequest): boolean {
  const adminSecret = request.headers.get('x-admin-secret')
  return adminSecret === process.env.ADMIN_SECRET
}

export function requireAdmin(request: NextRequest): void {
  if (!isAdmin(request)) {
    throw new Error('Admin access required')
  }
}
