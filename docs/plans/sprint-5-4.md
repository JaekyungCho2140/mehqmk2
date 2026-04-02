# Sprint 5-4: TM Editor

## Scope

TM의 엔트리를 직접 편집할 수 있는 TM Editor를 구현한다. AG Grid 기반 목록, Find&Replace, Flagging 기능을 포함한다.

### 생성/수정할 파일

```
src/renderer/views/TmEditor.tsx                # TM Editor 메인 뷰
src/renderer/components/tm/TmEntryGrid.tsx     # AG Grid 엔트리 목록
src/renderer/components/tm/TmFindReplace.tsx   # TM 내 Find&Replace
src/renderer/hooks/useTmEditor.ts              # TM Editor 로직 훅
src/renderer/App.tsx                           # (수정) TM Editor 뷰 추가
src/shared/types/ipc.ts                        # (수정) TM 엔트리 CRUD 채널
src/main/ipc/tm.ts                             # (수정) 엔트리 편집 핸들러
src/renderer/styles/tm-editor.css              # TM Editor 스타일
```

## 주요 동작 흐름

### TM Editor 진입

```
입력: Project Home → TM 목록에서 TM 더블클릭 (또는 우클릭 → Edit)
출력: TM Editor 뷰
  - 상단: TM 이름 + 엔트리 수 + "Save" 버튼
  - 중앙: AG Grid (Source/Target/Created by/Modified at/Flagged 컬럼)
  - 하단: Find&Replace 바 (Ctrl+H로 토글)
```

### 엔트리 편집

```
더블클릭: Source 또는 Target 셀 → 인라인 편집 (AG Grid cellEditor)
New: 빈 행 추가 (하단 버튼)
Delete: 선택 행 삭제 (Ctrl+Delete 또는 버튼)
Ctrl+S: 변경사항 DB 저장 (자동 저장 아님)
```

### Find & Replace

```
Ctrl+H: Find&Replace 바 토글
  - Find: 텍스트 입력 → Source/Target에서 검색
  - Replace: 교체 텍스트
  - "Find Next" / "Replace" / "Replace All"
  - Case sensitive 토글
```

### Flagging

```
Ctrl+M: 선택 엔트리 플래그 토글
플래그 아이콘: 빨간 깃발 (Flagged 컬럼)
필터: 플래그된 항목만 표시 토글
```

## Acceptance Criteria

- [ ] TM Editor에서 엔트리 목록 표시
- [ ] Source/Target 인라인 편집
- [ ] New/Delete 동작
- [ ] Ctrl+S 저장
- [ ] Find&Replace 동작
- [ ] Ctrl+M 플래그 토글
- [ ] ← Dashboard 복귀

## QA Checklist

- [ ] TM 더블클릭 → TM Editor 열림
- [ ] 셀 편집 → Ctrl+S → DB 저장 확인
- [ ] New → 빈 행 → 입력 → Save
- [ ] Delete → 확인 → 엔트리 제거
- [ ] Find "Hello" → 해당 셀 하이라이트
- [ ] Replace → 교체 확인
- [ ] Ctrl+M → 플래그 표시

## Dependencies

- Sprint 5-3 완료 필수

## Out of Scope

- 태그 편집 (Phase 8)
- Advanced filter (Phase 9)
