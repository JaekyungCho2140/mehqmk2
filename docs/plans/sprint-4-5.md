# Sprint 4-5: Filter Configurations + Import Settings

## Scope

문서 Import 시 필터 설정을 관리하는 기본 UI를 구현한다. 확장자 자동 인식, 수동 오버라이드, 기본 Import 옵션을 제공한다.

### 생성/수정할 파일

```
src/renderer/components/ImportSettingsDialog.tsx  # Import 설정 다이얼로그
src/renderer/views/wizard/ProjectDocuments.tsx    # (수정) Import with options 버튼
src/main/parsers/index.ts                         # (수정) 옵션 전달 지원
src/shared/types/import-settings.ts               # Import 설정 타입
```

## 핵심 동작

### Import Settings 다이얼로그

```
트리거: "Import with options" 버튼 또는 파일 우클릭 → "Import Settings"

설정 항목:
  - Filter: 자동 감지 (확장자 기반) 또는 수동 선택 드롭다운
    옵션: XLIFF, PO Gettext, TMX, mehQ XLIFF
  - Encoding: UTF-8 (기본), UTF-16, ISO-8859-1 등
  - 인라인 태그 처리: 보존 (기본) / 제거
  - 빈 Target 처리: 비워두기 (기본) / Source 복사

"OK" → 설정 적용 후 Import
"Cancel" → 설정 무시

설정 저장: 프로젝트별 DB에 JSON으로 저장 (documents 테이블 import_settings 컬럼)
```

## Acceptance Criteria

- [ ] Import Settings 다이얼로그 표시
- [ ] 필터 수동 선택 동작
- [ ] 인코딩 선택 동작
- [ ] 설정이 Import에 반영
- [ ] 프로젝트별 설정 저장/복원

## QA Checklist

- [ ] Import with options → 다이얼로그 → OK → 설정 적용
- [ ] 필터 수동 오버라이드 → 올바른 파서 사용
- [ ] Cancel → Import 취소

## Dependencies

- Sprint 4-4 완료 필수

## Out of Scope

- Cascading Filters (Phase 10)
- Preview (Phase 10)
