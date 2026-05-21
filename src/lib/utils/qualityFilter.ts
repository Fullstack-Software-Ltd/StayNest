/**
 * Checks if a property's name and description meet minimum quality standards.
 * Filters out gibberish, placeholders, and very short entries.
 */
export function isHighQualityProperty(name: string, description: string): boolean {
  if (!name || !description) return false;

  const cleanName = name.trim();
  const cleanDesc = description.trim();

  // Basic length checks
  if (cleanName.length < 1) return false;
  if (cleanDesc.length < 1) return false;

  // Placeholder checks
  const placeholders = ['test', 'demo', 'gsgsgsh', 'eheeh', 'gwwv', 'placeholder', 'dummy'];
  if (placeholders.some(p => cleanName.toLowerCase().includes(p) || cleanDesc.toLowerCase().includes(p))) {
    return false;
  }

  // Gibberish: Repeating characters (e.g., "aaaaa")
  if (/(.)\1{4,}/.test(cleanName) || /(.)\1{6,}/.test(cleanDesc)) {
    return false;
  }

  // Gibberish: No vowels in a relatively long name (likely nonsense)
  if (!/[aeiouAEIOU]/.test(cleanName) && cleanName.length > 5) {
    return false;
  }

  // Gibberish: Random string (no spaces in a long name)
  if (cleanName.length > 15 && !cleanName.includes(' ')) {
    return false;
  }

  return true;
}
