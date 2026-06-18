import { NextResponse } from 'next/server'

// Simple demo auth (in production, use proper JWT + database)
const ADMIN_USERS = [
  { id: 1, email: 'admin@jobhub.com', password: 'admin123', name: 'Admin User', role: 'superadmin' },
]

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = ADMIN_USERS.find(
      (u) => u.email === email && u.password === password
    )

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create a simple token (in production, use JWT)
    const token = Buffer.from(`${user.email}:${Date.now()}`).toString('base64')

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
