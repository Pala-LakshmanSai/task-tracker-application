import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!

let cached = (global as any).mongoose
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'task-tracker-app',
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
