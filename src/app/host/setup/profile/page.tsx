import { auth } from '@/auth'
import { getProfile } from '@/lib/auth/getProfile'
import { redirect } from 'next/navigation'
import HostProfileSetupClient from './ProfileSetupClient'

export default async function HostProfileSetupPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login?redirect=/host/setup/profile')
  }
  
  const initialProfile = await getProfile(session.user.id)

  return <HostProfileSetupClient initialProfile={initialProfile} />
}
