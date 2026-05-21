import { LoginForm } from '@/components/auth/LoginForm'
import { getPublicPlatformAnalytics } from '@/lib/admin/adminActions'

export default async function LoginPage() {
  const stats = await getPublicPlatformAnalytics()

  return <LoginForm stats={stats} />
}
