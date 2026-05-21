import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { getPublicPlatformAnalytics } from '@/lib/admin/adminActions'

export default async function ForgotPasswordPage() {
  const stats = await getPublicPlatformAnalytics()

  return <ForgotPasswordForm stats={stats} />
}
