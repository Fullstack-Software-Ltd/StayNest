/**
 * Utility to sanitize Prisma objects for Next.js Client Components.
 * Converts Decimal to number and ensures the object is a plain JS object.
 */
export function sanitizePrismaObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizePrismaObject(item)) as unknown as T
  }
  
  // Handle objects
  if (typeof obj === 'object') {
    const plainObj = JSON.parse(JSON.stringify(obj))
    
    // Explicitly convert Decimal fields if they are still symbols/complex
    const sanitize = (o: any) => {
      for (const key in o) {
        if (o[key] && typeof o[key] === 'object' && o[key].constructor?.name === 'Decimal') {
          o[key] = Number(o[key])
        } else if (o[key] && typeof o[key] === 'object') {
          sanitize(o[key])
        }
        
        // Also handle common StayNest Decimal fields just in case JSON.stringify didn't catch them as numbers
        if (['daily_price', 'monthly_price', 'latitude', 'longitude', 'amount', 'price_per_night', 'total_price'].includes(key)) {
          if (o[key] !== null && o[key] !== undefined) {
            o[key] = Number(o[key])
          }
        }
      }
      return o
    }
    
    return sanitize(plainObj)
  }
  
  return obj
}
