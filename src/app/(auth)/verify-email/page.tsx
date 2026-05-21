import { VerifyEmailForm } from '@/components/auth/VerifyEmailForm'
import { getPublicPlatformAnalytics } from '@/lib/admin/adminActions'

export default async function VerifyEmailPage() {
  const stats = await getPublicPlatformAnalytics()

  return <VerifyEmailForm stats={stats} />
}
