/**
 * Number pattern: integers, decimals, comma-separated numbers.
 */
const NUMBER_PATTERN = /\d+[\d,.]*\d*|\d/g;

/**
 * Extract all numbers from a string.
 */
function extractNumbers(text: string): string[] {
  return text.match(NUMBER_PATTERN) ?? [];
}

/**
 * Replace all numbers with a placeholder to compare text structure.
 */
function normalizeNumbers(text: string): string {
  return text.replace(NUMBER_PATTERN, '\x00NUM\x00');
}

/**
 * Check if two strings differ only in numbers.
 * Returns null if they differ in non-numeric parts.
 * Returns the substituted target if only numbers differ.
 */
export function tryNumberSubstitution(
  searchSource: string,
  tuSource: string,
  tuTarget: string,
): { substitutedTarget: string } | null {
  const normalizedSearch = normalizeNumbers(searchSource);
  const normalizedTu = normalizeNumbers(tuSource);

  if (normalizedSearch !== normalizedTu) {
    return null;
  }

  const searchNumbers = extractNumbers(searchSource);
  const tuNumbers = extractNumbers(tuSource);

  if (searchNumbers.length !== tuNumbers.length) {
    return null;
  }

  // If numbers are the same, no substitution needed
  if (searchNumbers.every((n, i) => n === tuNumbers[i])) {
    return null;
  }

  // Substitute numbers in target
  let substitutedTarget = tuTarget;
  const targetNumbers = extractNumbers(tuTarget);

  // Build a mapping from TU source numbers to search source numbers
  for (let i = 0; i < tuNumbers.length; i++) {
    const tuNum = tuNumbers[i];
    const searchNum = searchNumbers[i];

    // Find and replace matching number in target
    const targetIdx = targetNumbers.indexOf(tuNum);
    if (targetIdx !== -1) {
      substitutedTarget = substitutedTarget.replace(tuNum, searchNum);
      targetNumbers[targetIdx] = searchNum; // Prevent double replacement
    }
  }

  return { substitutedTarget };
}
