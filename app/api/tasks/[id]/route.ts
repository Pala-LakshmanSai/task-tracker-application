import { connectDB } from "@/lib/mongoose"
import { NextRequest, NextResponse } from "next/server"
import Task from "@/models/Tasks"

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB()

  const deleted = await Task.findByIdAndDelete(params.id)

  if (!deleted) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Task deleted successfully' })
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB()
  const body = await req.json()
  const updated = await Task.findByIdAndUpdate(params.id, body, { new: true })
  return NextResponse.json(updated)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB()

  const body = await req.json()

  const task = await Task.findByIdAndUpdate(params.id, body, {
    new: true,
  })

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  return NextResponse.json(task)
}