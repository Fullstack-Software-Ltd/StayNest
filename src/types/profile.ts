export type UserRole = 'guest' | 'owner' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  status?: string;
  legal_name?: string;
  preferred_name?: string;
  language?: string;
  currency?: string;
  created_at: string;
}
