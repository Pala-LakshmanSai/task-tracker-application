// app/api/user/name/route.ts
import { NextResponse } from 'next/server'
import User from '@/models/User'

export async function POST(req: Request) {
  const { email } = await req.json()

  const user = await User.findOne({ email })
  return NextResponse.json({ name: user?.name || null })
}
