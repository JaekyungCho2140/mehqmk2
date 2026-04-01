# Sprint 4-3: New Project Wizard Documents 단계

## Scope

New Project Wizard에 Documents 단계를 추가한다. 드래그앤드롭으로 파일을 추가하고, 확장자 기반 필터 자동 선택, Import 실행까지. Wizard를 Step 1(Details) → Step 2(Documents) → Finish 3단계로 확장한다.

### 생성/수정할 파일

```
src/renderer/views/wizard/ProjectDocuments.tsx   # Step 2: 문서 추가/Import
src/renderer/views/NewProjectWizard.tsx          # (수정) Step 2 추가
src/renderer/components/FileDropZone.tsx          # 드래그앤드롭 영역
src/shared/types/ipc.ts                          # (수정) dialog:open-files 채널
src/main/ipc/documents.ts                        # (수정) 파일 선택 다이얼로그
src/preload/index.ts                             # (수정) dialog.openFiles API
```

## 주요 동작 흐름

### Documents 단계 UI

```
레이아웃:
  상단: "Documents" 제목 + 설명
  중앙: FileDropZone (드래그앤드롭 영역, height: 200px)
    - 기본: 점선 테두리 + "파일을 드래그하거나 클릭하여 추가" 텍스트
    - 드래그 오버: 배경 #eff6ff, 테두리 var(--color-accent-primary)
    - 추가된 파일: 파일명 + 형식 + 크기 + ✕ 제거 버튼 리스트
  하단: "Import" 버튼 (파일 선택 다이얼로그) + "Remove All" 버튼

동작:
  1. 드래그앤드롭 또는 "Import" 버튼 → 파일 경로 수집
  2. 확장자로 필터 자동 선택 (.xliff→XLIFF, .po→PO 등)
  3. 파일 리스트에 추가 (미파싱 상태)
  4. "Next" 또는 "Finish" 클릭 시 실제 파싱 + DB 저장

Finish 시:
  1. 프로젝트 생성 (Sprint 2-1 로직)
  2. 각 파일을 파서 레지스트리로 파싱
  3. documents + segments DB 저장
  4. Dashboard로 복귀
```

## Acceptance Criteria

- [ ] Wizard Step 2에 FileDropZone 표시
- [ ] 드래그앤드롭으로 파일 추가
- [ ] "Import" 버튼 → 파일 선택 다이얼로그
- [ ] 파일 리스트에 이름/형식/크기 표시
- [ ] ✕ 버튼으로 파일 제거
- [ ] Finish → 프로젝트 + 문서 + 세그먼트 일괄 생성
- [ ] 지원하지 않는 형식 → 경고 메시지

## QA Checklist

- [ ] 드래그앤드롭 → 파일 추가
- [ ] Import 버튼 → 다이얼로그 → 파일 선택
- [ ] .xliff + .po 혼합 추가 → 각각 올바른 형식 표시
- [ ] Finish → Dashboard에 프로젝트, 에디터에서 세그먼트 확인
- [ ] .txt (미지원) 추가 → 경고

## Dependencies

- Sprint 4-2 완료 필수

## Out of Scope

- Import Settings 상세 UI (Sprint 4-5)
- Cascading Filters (Phase 10)
