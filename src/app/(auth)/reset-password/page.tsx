import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { getPublicPlatformAnalytics } from '@/lib/admin/adminActions'

export default async function ResetPasswordPage() {
  const stats = await getPublicPlatformAnalytics()

  return <ResetPasswordForm stats={stats} />
}
