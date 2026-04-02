import type { Segment } from '../../shared/types/segment';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getXliffState(status: string): string | null {
  switch (status) {
    case 'confirmed':
    case 'r1-confirmed':
    case 'r2-confirmed':
      return 'final';
    case 'edited':
      return 'needs-review-translation';
    case 'pre-translated':
      return 'translated';
    default:
      return null;
  }
}

export function exportXliff12(
  segments: Segment[],
  sourceLang: string,
  targetLang: string,
  originalFile: string,
): string {
  const units = segments
    .map((seg) => {
      const state = getXliffState(seg.status);
      const stateAttr = state ? ` state="${state}"` : '';
      const targetContent = seg.target
        ? `<target${stateAttr}>${escapeXml(seg.target)}</target>`
        : `<target${stateAttr}/>`;

      return `    <trans-unit id="${seg.index}">
      <source>${escapeXml(seg.source)}</source>
      ${targetContent}
    </trans-unit>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="${sourceLang}" target-language="${targetLang}" datatype="plaintext" original="${escapeXml(originalFile)}">
    <body>
${units}
    </body>
  </file>
</xliff>
`;
}

export function exportXliff20(
  segments: Segment[],
  sourceLang: string,
  targetLang: string,
  originalFile: string,
): string {
  const units = segments
    .map((seg) => {
      const targetContent = seg.target ? `<target>${escapeXml(seg.target)}</target>` : '<target/>';

      return `    <unit id="u${seg.index}">
      <segment>
        <source>${escapeXml(seg.source)}</source>
        ${targetContent}
      </segment>
    </unit>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="${sourceLang}" trgLang="${targetLang}">
  <file id="f1" original="${escapeXml(originalFile)}">
${units}
  </file>
</xliff>
`;
}
