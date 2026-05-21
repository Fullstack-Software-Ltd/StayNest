/**
 * UrugoStay Financial Utilities
 * Standardized commission calculations for the whole platform.
 */

export const PLATFORM_FEE_PERCENTAGE = 0.10; // 10%

/**
 * Calculates the breakdown of a booking price.
 * @param gross Total amount paid by the guest
 * @returns { gross, fee, net }
 */
export function calculatePayout(gross: number) {
  const fee = gross * PLATFORM_FEE_PERCENTAGE;
  const net = gross - fee;
  
  return {
    gross: Math.round(gross * 100) / 100,
    fee: Math.round(fee * 100) / 100,
    net: Math.round(net * 100) / 100
  };
}

/**
 * Formats a number as a currency string.
 */
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
