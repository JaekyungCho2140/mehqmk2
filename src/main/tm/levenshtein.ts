/**
 * Character-level Levenshtein distance.
 */
export function charDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  if (m === 0) return n;
  if (n === 0) return m;

  // Use single-row optimization
  let prev = new Array<number>(n + 1);
  let curr = new Array<number>(n + 1);

  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,      // deletion
        curr[j - 1] + 1,  // insertion
        prev[j - 1] + cost // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }

  return prev[n];
}

/**
 * Word-level Levenshtein distance with length-weighted comparison.
 */
export function wordDistance(a: string, b: string): number {
  const wordsA = a.split(/\s+/).filter(Boolean);
  const wordsB = b.split(/\s+/).filter(Boolean);
  const m = wordsA.length;
  const n = wordsB.length;

  if (m === 0) return n;
  if (n === 0) return m;

  let prev = new Array<number>(n + 1);
  let curr = new Array<number>(n + 1);

  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = wordsA[i - 1] === wordsB[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost
      );
    }
    [prev, curr] = [curr, prev];
  }

  return prev[n];
}

/**
 * Calculate match rate (0-100) based on Levenshtein distance.
 * Uses character-level for short strings, word-level for longer ones.
 */
export function calculateFuzzyRate(source: string, candidate: string): number {
  const wordCount = source.split(/\s+/).filter(Boolean).length;

  if (wordCount <= 5 || source.length < 128) {
    const dist = charDistance(source, candidate);
    const maxLen = Math.max(source.length, candidate.length);
    if (maxLen === 0) return 100;
    return Math.round((1 - dist / maxLen) * 100);
  }

  const dist = wordDistance(source, candidate);
  const maxWords = Math.max(
    source.split(/\s+/).filter(Boolean).length,
    candidate.split(/\s+/).filter(Boolean).length,
  );
  if (maxWords === 0) return 100;
  return Math.round((1 - dist / maxWords) * 100);
}
