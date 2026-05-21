'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function registerUser(formData: any) {
  const { fullName, email, password } = formData

  if (!fullName || !email || !password) {
    throw new Error('Please fill in all fields')
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new Error('This email is already registered.')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            full_name: fullName,
            email,
            role: 'guest',
            status: 'active'
          }
        }
      }
    })

    return { success: true, userId: user.id }
  } catch (error: any) {
    console.error('Registration error:', error)
    throw new Error(error.message || 'Registration failed')
  }
}
