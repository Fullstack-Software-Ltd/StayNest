import { getUser } from '@/lib/auth/getUser'
import { getProfile } from '@/lib/auth/getProfile'
import { SettingsForm } from '@/components/settings/SettingsForm'
import { PageHeader } from '@/components/shared/page-header'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const user = await getUser()
  if (!user) {
    redirect('/login?next=/settings')
  }

  const profile = await getProfile(user.id)
  if (!profile) {
    return <div>Error loading profile.</div>
  }

  return (
    <div className="bg-[var(--warm-white)] min-h-screen pt-6 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader 
          title="settings.title" 
          subtitle="settings.subtitle"
        />

        <div className="mt-8">
          <SettingsForm initialProfile={profile} />
        </div>
      </div>
    </div>
  )
}
