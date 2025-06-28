import { cookies } from 'next/headers'
const jwt = require("jsonwebtoken")


export const isLoggedIn =  () => {
    const user = getUserFromToken();
    if (!user) return false;
    return true;
}
export async function getUserFromToken() {
  const token = (await cookies()).get('token')?.value
  if (!token) return null

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as { email: string }
    return user
  } catch {
    return null
  }
}