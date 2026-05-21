import { RegisterForm } from '@/components/auth/RegisterForm'
import { getPublicPlatformAnalytics } from '@/lib/admin/adminActions'

export default async function RegisterPage() {
  const stats = await getPublicPlatformAnalytics()

  return <RegisterForm stats={stats} />
}
