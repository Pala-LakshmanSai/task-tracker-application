import { connectDB } from "@/lib/mongoose";
import Task from "@/models/Tasks"
import { NextRequest, NextResponse } from 'next/server'
import { TaskCreateSchema } from "@/lib/validation/tasks";
import { cookies } from "next/headers";


const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET!; // Make sure it's defined in .env.local

export async function GET(req: NextRequest) {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const showArchived = searchParams.get('archived') === 'true'




  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  let userId = null

  if (!token) {
    return NextResponse.json({ error: 'No token found in cookies' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userId = decoded.id

  } catch (err) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }



  const tasks = await Task.find({ archived: showArchived, userId: userId }).sort({ createdAt: -1 })

  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()
   const parse = TaskCreateSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.format() }, { status: 400 })
  }



  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  let userId: string = "";

  if (!token) {
    return NextResponse.json({ error: 'No token found in cookies' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userId = decoded.id

  } catch (err) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }





  const task = await Task.create({...parse.data, userId})

  return NextResponse.json(task, { status: 201 })
}
