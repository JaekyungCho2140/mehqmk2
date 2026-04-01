# Sprint 4-1: XLIFF 파서 + segments DB 테이블

## Scope

XLIFF 1.2 및 2.0 파서를 구현하여 bilingual 파일에서 세그먼트를 추출하고, segments DB 테이블에 저장한다. 에디터가 하드코딩 세그먼트 대신 DB에서 실제 세그먼트를 로드하도록 전환한다.

### 생성/수정할 파일

```
src/db/migrations/003-segments.ts              # segments 테이블
src/db/repositories/segments.ts                # Segment CRUD
src/main/parsers/xliff.ts                      # XLIFF 1.2 + 2.0 파서
src/main/parsers/types.ts                      # 파서 공통 타입/인터페이스
src/main/ipc/documents.ts                      # 문서 Import IPC 핸들러
src/main/ipc/segments.ts                       # 세그먼트 IPC 핸들러
src/main/ipc/index.ts                          # (수정) 핸들러 등록
src/preload/index.ts                           # (수정) document/segment API 추가
src/shared/types/ipc.ts                        # (수정) IPC 채널 추가
src/shared/types/segment.ts                    # (수정) DB 매핑 필드 추가
src/renderer/views/TranslationEditor.tsx       # (수정) DB에서 세그먼트 로드
tests/fixtures/sample.xliff                    # 테스트용 XLIFF 1.2 파일
tests/fixtures/sample-v2.xliff                 # 테스트용 XLIFF 2.0 파일
```

## Technical Prerequisites (Planner 확인)

- [x] XLIFF 1.2는 XML 기반 (`<trans-unit>` 요소), Node.js 내장 또는 `fast-xml-parser`로 파싱
- [x] XLIFF 2.0은 네임스페이스 다름 (`<unit>` + `<segment>`), 동일 XML 파서 사용 가능
- [ ] ⚠️ 미확인: `fast-xml-parser` vs `xml2js` 중 XLIFF 인라인 태그 보존에 적합한 쪽 → Generator 확인

### 설치 (필요 시)

```bash
npm install fast-xml-parser   # 또는 xml2js
```

## 핵심 데이터 모델

### segments 테이블

```sql
CREATE TABLE segments (
  id           TEXT PRIMARY KEY,
  document_id  TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  index_num    INTEGER NOT NULL,  -- 문서 내 순서 (1-based)
  source       TEXT NOT NULL,     -- Source 텍스트 (HTML/plain)
  target       TEXT DEFAULT '',   -- Target 텍스트
  status       TEXT NOT NULL DEFAULT 'not-started',
  locked       INTEGER DEFAULT 0, -- boolean
  match_rate   INTEGER DEFAULT NULL,
  modified     INTEGER DEFAULT 0, -- boolean
  confirmed_by TEXT DEFAULT NULL,
  confirmed_at TEXT DEFAULT NULL,
  context_id   TEXT DEFAULT NULL, -- XLIFF context (resname 등)
  notes        TEXT DEFAULT NULL, -- XLIFF notes
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(document_id, index_num)
);
```

### IPC 채널 추가

```typescript
DOCUMENT_IMPORT:     'document:import',       // { projectId, filePath } → Document
SEGMENTS_LIST:       'segments:list',         // { documentId } → Segment[]
SEGMENTS_UPDATE:     'segments:update',       // { id, target, status, ... } → Segment
SEGMENTS_BULK_UPDATE: 'segments:bulk-update', // Segment[] → void
```

### XLIFF 파서 인터페이스

```typescript
interface ParsedSegment {
  index: number;
  source: string;       // 텍스트 (인라인 태그 HTML로 변환)
  target: string;
  contextId?: string;   // resname, id 등
  notes?: string;
  status: SegmentStatus;
}

interface ParseResult {
  format: 'xliff-1.2' | 'xliff-2.0';
  sourceLanguage: string;
  targetLanguage: string;
  segments: ParsedSegment[];
  originalFileName?: string;
}

// 파서 함수
function parseXliff(filePath: string): ParseResult;
```

## 주요 동작 흐름

### 1. XLIFF Import

```
입력: 파일 경로 (dialog.showOpenDialog 또는 드래그앤드롭)
과정:
  1. 파일 읽기 (fs.readFileSync)
  2. XML 파싱 → XLIFF 버전 감지 (1.2 vs 2.0)
  3. trans-unit/unit 순회 → ParsedSegment[] 추출
  4. documents 테이블에 레코드 삽입
  5. segments 테이블에 일괄 삽입 (트랜잭션)
출력: Document 객체 + Segment[] 저장 완료

XLIFF 1.2 구조:
  <xliff version="1.2">
    <file source-language="en" target-language="ko">
      <body>
        <trans-unit id="1">
          <source>Hello</source>
          <target>안녕하세요</target>
          <note>Greeting</note>
        </trans-unit>
      </body>
    </file>
  </xliff>

XLIFF 2.0 구조:
  <xliff version="2.0" srcLang="en" trgLang="ko">
    <file id="f1">
      <unit id="1">
        <segment>
          <source>Hello</source>
          <target>안녕하세요</target>
        </segment>
      </unit>
    </file>
  </xliff>
```

### 2. 에디터에서 DB 세그먼트 로드

```
입력: TranslationEditor 마운트 (documentId 전달)
과정:
  1. window.electronAPI.segments.list({ documentId }) 호출
  2. Segment[] 반환
  3. AG Grid에 바인딩 (하드코딩 샘플 대체)
출력: 실제 XLIFF 세그먼트가 에디터에 표시
```

### 3. 세그먼트 편집 시 DB 저장

```
입력: 세그먼트 전환 또는 Ctrl+Enter
과정:
  1. 현재 세그먼트의 변경사항 수집 (target, status 등)
  2. window.electronAPI.segments.update({ id, target, status, ... })
  3. main: UPDATE segments SET target=?, status=?, updated_at=datetime('now') WHERE id=?
출력: DB에 변경사항 영속

Debounce: 세그먼트 전환 시 즉시 저장, 편집 중에는 5초 interval 자동 저장
```

## 테스트 픽스처

### sample.xliff (XLIFF 1.2, 10 세그먼트)
```
영어→한국어 번역 샘플:
1. "Hello, world!" → ""
2. "File" → "파일"
3. "Edit" → "편집"
4. "Save" → "저장"
5. "Close" → "닫기"
6. "New Project" → ""
7. "Open" → "열기"
8. "Settings" → "설정"
9. "Help" → "도움말"
10. "About mehQ" → ""
(빈 target은 미번역 세그먼트)
```

### sample-v2.xliff (XLIFF 2.0, 5 세그먼트)
```
동일 패턴, XLIFF 2.0 형식
```

## Acceptance Criteria

- [ ] XLIFF 1.2 파일 파싱 → 세그먼트 추출 성공
- [ ] XLIFF 2.0 파일 파싱 → 세그먼트 추출 성공
- [ ] Import 시 documents + segments DB에 저장
- [ ] 에디터에서 DB 세그먼트 로드 (하드코딩 대체)
- [ ] 세그먼트 편집 → DB 저장 (세그먼트 전환 시)
- [ ] 앱 재시작 후 세그먼트 유지 (DB 영속)
- [ ] XLIFF의 source-language/target-language가 프로젝트 언어와 일치 확인

## QA Checklist

- [ ] sample.xliff Import → 10개 세그먼트 에디터 표시
- [ ] sample-v2.xliff Import → 5개 세그먼트 표시
- [ ] 빈 target 세그먼트 → status 'not-started'
- [ ] 기존 target 세그먼트 → status 'pre-translated'
- [ ] 편집 → 세그먼트 전환 → 원래 세그먼트로 돌아옴 → 편집 유지
- [ ] 앱 재시작 → 세그먼트 유지

## Regression Checklist

- [ ] Phase 3: 에디터 전체 (네비게이션, 확인, 서식, 상태)
- [ ] Phase 2: Dashboard, Project CRUD
- [ ] Phase 1: E2E 전체 통과

## Known Gaps (memoQ 대비)

- 인라인 태그 보존은 기본 수준 (Phase 8에서 완전한 태그 시스템)
- Import Settings UI는 Sprint 4-5에서
- Cascading Filters는 Phase 10에서

## Verification Questions (Generator가 구현 전에 확인)

- [ ] `fast-xml-parser`가 XLIFF의 인라인 태그(`<bpt>`, `<ept>`, `<ph>`)를 올바르게 보존하는가?
- [ ] XLIFF 파일이 UTF-8 BOM이 있는 경우에도 파싱 가능한가?

## Dependencies

- Phase 3 전체 완료 필수

## Out of Scope

- PO/TMX 파서 (Sprint 4-2)
- New Project Wizard Documents 단계 (Sprint 4-3)
- Export (Sprint 4-4)
