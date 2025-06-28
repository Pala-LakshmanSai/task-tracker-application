import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hash } from 'bcryptjs'
import { signToken } from '@/lib/jwt'
import { connectDB} from '@/lib/mongoose'
import User from '@/models/User'

const SignupSchema = z.object({
    name: z.string(),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = SignupSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    await connectDB()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })

    const token = signToken({ id: user._id, email: user.email })

    const res = NextResponse.json({
      message: 'Signup successful',
      user: { id: user._id, name: user.name, email: user.email },
    })

    res.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return res
  } catch (err) {
    console.error('[SIGNUP_ERROR]', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
