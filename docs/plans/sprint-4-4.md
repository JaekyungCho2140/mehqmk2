# Sprint 4-4: Export (XLIFF/PO 내보내기)

## Scope

번역된 세그먼트를 XLIFF, PO 형식으로 내보내기 한다. 번역 상태를 Export 파일에 반영하고, Import→편집→Export round-trip의 데이터 무손실을 보장한다.

### 생성/수정할 파일

```
src/main/exporters/xliff.ts              # XLIFF 1.2 + 2.0 내보내기
src/main/exporters/po.ts                 # PO Gettext 내보내기
src/main/exporters/index.ts              # 내보내기 레지스트리
src/main/ipc/documents.ts                # (수정) export IPC 핸들러
src/shared/types/ipc.ts                  # (수정) document:export 채널
src/preload/index.ts                     # (수정) export API
src/renderer/views/TranslationEditor.tsx # (수정) Export 버튼 추가 (상단 바)
src/renderer/views/project/GeneralTab.tsx # (수정) Export 버튼 추가
```

## 핵심 동작

### Export 흐름

```
입력: 에디터 상단 "Export" 버튼 클릭
과정:
  1. dialog.showSaveDialog({ defaultPath: 원본파일명, filters: [해당 형식] })
  2. DB에서 document + segments 조회
  3. 원본 형식에 맞는 exporter 호출
  4. 파일 쓰기
출력: 번역된 파일 저장

XLIFF Export:
  - 원본 XLIFF 구조 보존
  - <target> 요소에 번역 텍스트 삽입
  - state 속성: confirmed → "final", edited → "needs-review-translation", not-started → 생략
  
PO Export:
  - msgid/msgstr 쌍 생성
  - fuzzy 플래그: edited 상태 세그먼트에 적용
```

### Round-trip 무손실

```
검증: sample.xliff Import → 편집 → Export → 재Import
  - Source 텍스트 완전 일치
  - 인라인 태그 구조 보존 (기본 수준)
  - 번역 상태 매핑 정확
```

## Acceptance Criteria

- [ ] XLIFF Export → 유효한 XLIFF 파일 생성
- [ ] PO Export → 유효한 PO 파일 생성
- [ ] Export 시 번역 상태 반영 (state/fuzzy)
- [ ] Round-trip: Import → Export → 재Import → Source 일치
- [ ] 파일 저장 다이얼로그 동작
- [ ] Export 버튼이 에디터 상단 바에 표시

## QA Checklist

- [ ] XLIFF Import → 편집 → Export → 파일 생성 확인
- [ ] Export된 XLIFF를 텍스트 에디터로 열어 구조 확인
- [ ] PO Import → 편집 → Export → 재Import → 일치
- [ ] confirmed 세그먼트 → XLIFF state="final"
- [ ] 미번역 세그먼트 → target 비어있음

## Dependencies

- Sprint 4-3 완료 필수

## Out of Scope

- TMX Export (Phase 5 TM Export에서)
- Monolingual Export (Phase 10)
