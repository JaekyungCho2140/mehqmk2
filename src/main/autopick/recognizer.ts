export interface RecognizedItem {
  readonly type: 'number' | 'url' | 'capitalized';
  readonly value: string;
  readonly icon: string;
}

const NUMBER_PATTERN = /(?:\$|€|¥|£|₩)?[\d]+[\d,.']*[\d]+(?:\s?%)?|\d+(?:\.\d+)?(?:\s?%)?/g;
const URL_PATTERN = /(?:https?:\/\/|mailto:)\S+/gi;
const EMAIL_PATTERN = /[\w.+-]+@[\w.-]+\.\w+/g;
const CAPITALIZED_PATTERN = /\b[A-Z][A-Z]+\b/g;

export function recognizeItems(source: string): RecognizedItem[] {
  const items: RecognizedItem[] = [];
  const seen = new Set<string>();

  // Numbers
  for (const match of source.matchAll(NUMBER_PATTERN)) {
    const value = match[0];
    if (!seen.has(value)) {
      seen.add(value);
      items.push({ type: 'number', value, icon: '#' });
    }
  }

  // URLs
  for (const match of source.matchAll(URL_PATTERN)) {
    const value = match[0];
    if (!seen.has(value)) {
      seen.add(value);
      items.push({ type: 'url', value, icon: '@' });
    }
  }

  // Emails
  for (const match of source.matchAll(EMAIL_PATTERN)) {
    const value = match[0];
    if (!seen.has(value)) {
      seen.add(value);
      items.push({ type: 'url', value, icon: '@' });
    }
  }

  // Capitalized words (all-caps, min 2 chars)
  for (const match of source.matchAll(CAPITALIZED_PATTERN)) {
    const value = match[0];
    if (!seen.has(value)) {
      seen.add(value);
      items.push({ type: 'capitalized', value, icon: 'Aa' });
    }
  }

  return items;
}
