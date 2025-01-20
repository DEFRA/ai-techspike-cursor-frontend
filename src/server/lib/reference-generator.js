/**
 * Generates a unique reference number in the format APP-XXXX-XXXX
 * @returns {string} The generated reference number
 */
export function generateReference() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `APP-${timestamp.slice(-4)}-${random}`
} 