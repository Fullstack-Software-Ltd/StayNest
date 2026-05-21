'use client'

import { updateUserRole } from '@/lib/admin/adminActions'
import { Button } from '@/components/ui/Button'
import { User, Mail, Shield, UserCheck, MoreVertical, Calendar } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'

interface UserManagementRowProps {
  user: any
  onActionComplete: () => void
}

export function UserManagementRow({ user, onActionComplete }: UserManagementRowProps) {
  const [loading, setLoading] = useState(false)

  const handleRoleChange = async (newRole: string) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return
    
    setLoading(true)
    try {
      await updateUserRole(user.id, newRole)
      toast.success(`Role updated to ${newRole}`)
      onActionComplete()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all group focus-within:shadow-gray-200/50">
      <div className="flex items-center gap-6 w-full md:w-auto">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors relative overflow-hidden">
          {user.avatar_url ? (
            <Image 
              src={user.avatar_url} 
              alt={user.full_name} 
              fill
              sizes="56px"
              className="object-cover rounded-2xl" 
            />
          ) : (
            <User className="w-6 h-6" />
          )}
        </div>
        
        <div className="min-w-0">
          <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            {user.full_name}
            {user.role === 'admin' && (
              <Shield className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            )}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
            <p className="text-sm text-gray-400 font-medium flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              {user.email}
            </p>
            <p className="text-xs text-gray-300 font-bold uppercase tracking-widest flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Joined {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
          user.role === 'admin' 
            ? 'bg-red-50 text-red-600 border-red-100' 
            : user.role === 'owner' 
            ? 'bg-amber-50 text-amber-600 border-amber-100'
            : 'bg-blue-50 text-blue-600 border-blue-100'
        }`}>
          {user.role}
        </div>

        <div className="flex gap-2">
          {user.role !== 'admin' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRoleChange('admin')}
              disabled={loading}
              className="rounded-xl h-10 border-red-50 text-red-600 hover:bg-red-50 hover:border-red-100"
            >
              Make Admin
            </Button>
          )}
          {user.role === 'guest' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRoleChange('owner')}
              disabled={loading}
              className="rounded-xl h-10 border-amber-50 text-amber-600 hover:bg-amber-50 hover:border-amber-100"
            >
              Make Owner
            </Button>
          ) : user.role === 'owner' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRoleChange('guest')}
              disabled={loading}
              className="rounded-xl h-10 border-blue-50 text-blue-600 hover:bg-blue-50 hover:border-blue-100"
            >
              Make Guest
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
