import { redirect } from 'next/navigation'
import { getUser } from './getUser'

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}
