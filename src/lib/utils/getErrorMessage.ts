/**
 * Safely extract a user-readable error message from any error type.
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message
  }
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Map Supabase error codes to friendly messages.
 */
export function getFriendlyError(code?: string, message?: string): string {
  const codes: Record<string, string> = {
    '23505': 'This item already exists.',
    '23503': 'A linked record was not found.',
    '42501': 'You do not have permission to perform this action.',
    'PGRST116': 'The requested resource was not found.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/user-not-found': 'No account found with this email.',
  }
  if (code && codes[code]) return codes[code]
  return message || 'Something went wrong. Please try again.'
}
