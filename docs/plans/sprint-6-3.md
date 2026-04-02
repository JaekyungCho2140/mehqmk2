# Sprint 6-3: Automatic Lookup + Auto-insert

## Scope

세그먼트 이동 시 TM 자동 검색(Automatic Lookup)을 구현하고, 설정에 따라 최상위 결과를 자동 삽입(Auto-insert)하는 기능을 추가한다. 삽입 우선순위 로직을 확립한다.

### 생성/수정할 파일

```
src/renderer/hooks/useAutoLookup.ts                # 자동 조회 + 삽입 훅
src/renderer/components/AutoLookupSettings.tsx     # 설정 다이얼로그
src/renderer/views/TranslationEditor.tsx           # (수정) 자동 조회 통합
src/shared/types/settings.ts                       # (수정) auto_lookup 설정 추가
src/db/migrations/005-auto-lookup-settings.ts      # 설정 스키마
```

## 주요 동작 흐름

### Automatic Lookup

```
트리거: 세그먼트 이동 (클릭, Arrow, Tab, Ctrl+Enter 후 다음)
과정:
  1. 새 세그먼트의 source로 TM 검색 (Sprint 5-2 엔진)
  2. 결과를 Results Pane에 표시
  3. Auto-insert 설정 ON이면 → 최상위 결과 자동 삽입
설정:
  - Automatically scan: 세그먼트 이동 시 자동 검색 (기본 ON)
  - Auto-insert best result: 최상위 매치 자동 삽입 (기본 OFF)
  - Copy source if no match: 매치 없으면 Source를 Target에 복사 (기본 OFF)
```

### 삽입 우선순위

```
1. Best TM hit (매치율 최고)
2. Fragment Assembly 결과 (Sprint 6-6)
3. Source copy (설정 시)
```

### Auto-insert 조건

```
입력: 세그먼트 이동 + Auto-insert ON
조건:
  - Target이 비어있을 때만 (이미 편집된 세그먼트는 덮어쓰지 않음)
  - 매치율이 Good match 임계값(기본 85%) 이상
출력: Target에 자동 삽입, status → 'pre-translated'
```

## Acceptance Criteria

- [ ] 세그먼트 이동 시 자동 TM 검색 + Results Pane 갱신
- [ ] Auto-insert ON → 빈 Target에 자동 삽입
- [ ] Auto-insert OFF → 결과만 표시, 삽입은 수동
- [ ] Copy source if no match → 매치 없으면 Source 복사
- [ ] 이미 편집된 세그먼트는 자동 삽입 안 함
- [ ] 설정 다이얼로그 동작

## QA Checklist

- [ ] 세그먼트 이동 → Results Pane 자동 갱신
- [ ] Auto-insert ON + 빈 Target → 자동 삽입 확인
- [ ] Auto-insert ON + 편집된 Target → 삽입 안 됨
- [ ] 설정 변경 → 즉시 반영

## Dependencies

- Sprint 6-2 완료 필수
