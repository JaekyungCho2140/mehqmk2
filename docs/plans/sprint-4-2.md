# Sprint 4-2: PO Gettext + TMX + mehQ XLIFF 파서

## Scope

PO Gettext(.po), TMX(.tmx), mehQ XLIFF(.mqxliff) 파서를 추가한다. Sprint 4-1의 파서 인터페이스를 확장하여 다양한 bilingual 포맷을 통합 처리한다.

### 생성/수정할 파일

```
src/main/parsers/po.ts                   # PO Gettext 파서
src/main/parsers/tmx.ts                  # TMX 파서
src/main/parsers/mehq-xliff.ts           # mehQ XLIFF 파서 (확장 XLIFF)
src/main/parsers/index.ts                # 파서 레지스트리 (확장자→파서 매핑)
tests/fixtures/sample.po                 # 테스트용 PO 파일
tests/fixtures/sample.tmx               # 테스트용 TMX 파일
```

## 핵심 데이터 모델

### 파서 레지스트리

```typescript
// src/main/parsers/index.ts
const PARSER_MAP: Record<string, (filePath: string) => ParseResult> = {
  '.xliff': parseXliff,
  '.xlf': parseXliff,
  '.po': parsePo,
  '.tmx': parseTmx,
  '.mqxliff': parseMehqXliff,
};

function detectAndParse(filePath: string): ParseResult {
  const ext = path.extname(filePath).toLowerCase();
  const parser = PARSER_MAP[ext];
  if (!parser) throw new Error(`지원하지 않는 형식: ${ext}`);
  return parser(filePath);
}
```

### PO 파서 핵심

```
PO 파일 구조:
  msgid "Hello"
  msgstr "안녕하세요"

  msgid "File"
  msgstr "파일"

파싱: 정규식 기반 (XML 아님), msgid/msgstr 쌍 추출
복수형: msgid_plural + msgstr[0], msgstr[1] → 별도 세그먼트로 분리
주석: # translator-comments → notes 필드
```

### TMX 파서 핵심

```
TMX 구조:
  <tmx version="1.4">
    <body>
      <tu>
        <tuv xml:lang="en"><seg>Hello</seg></tuv>
        <tuv xml:lang="ko"><seg>안녕하세요</seg></tuv>
      </tu>
    </body>
  </tmx>

파싱: XML 파서 사용, tu/tuv 순회, source/target 언어 매칭
```

## Acceptance Criteria

- [ ] PO 파일 Import → 세그먼트 추출 + DB 저장
- [ ] TMX 파일 Import → 세그먼트 추출 + DB 저장
- [ ] mehQ XLIFF Import → 세그먼트 추출 + DB 저장
- [ ] 파서 레지스트리로 확장자 자동 감지
- [ ] 지원하지 않는 확장자 → 에러 메시지

## QA Checklist

- [ ] sample.po Import → 에디터에 세그먼트 표시
- [ ] sample.tmx Import → 에디터에 세그먼트 표시
- [ ] PO 복수형 → 별도 세그먼트로 분리
- [ ] TMX 다국어 → source/target 언어 정확 매칭

## Regression Checklist

- [ ] Sprint 4-1: XLIFF 파싱, DB 저장, 에디터 로드

## Dependencies

- Sprint 4-1 완료 필수

## Out of Scope

- Monolingual 포맷 (Phase 10)
- SDLXLIFF (범위 밖)
