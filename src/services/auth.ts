import { auth, signOut as nextSignOut } from '@/auth'

export async function getUser() {
  const session = await auth()
  return session?.user
}

export async function signOut() {
  await nextSignOut()
}
