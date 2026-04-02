# Sprint 5-5: TM Import/Export + TM Settings

## Scope

TMX/CSV 형식으로 TM Import/Export를 구현하고, TM Settings(매치 임계값, 역할, 페널티)를 관리하는 UI를 만든다.

### 생성/수정할 파일

```
src/main/tm/import-tmx.ts                 # TMX → TM Import
src/main/tm/import-csv.ts                 # CSV → TM Import
src/main/tm/export-tmx.ts                 # TM → TMX Export
src/renderer/components/TmSettingsDialog.tsx # TM Settings 다이얼로그
src/renderer/components/TmImportWizard.tsx  # TM Import 마법사
src/shared/types/tm.ts                     # (수정) TmSettings 타입
src/shared/types/ipc.ts                    # (수정) TM import/export 채널
src/main/ipc/tm.ts                         # (수정) import/export/settings 핸들러
```

## 주요 동작 흐름

### TM Import (TMX)

```
입력: TM Editor 또는 Project Home에서 "Import TMX" 클릭
과정:
  1. 파일 선택 다이얼로그 (.tmx)
  2. TMX 파싱 → translation_units 변환
  3. 일괄 INSERT (중복 source → allow_multiple에 따라 덮어쓰기 또는 추가)
  4. 진행률 표시 (대용량 TMX 대응)
출력: TM에 엔트리 추가, entry_count 갱신
```

### TM Import (CSV)

```
입력: CSV 파일 (Source,Target 2열 또는 헤더 포함)
과정: CSV 파싱 → translation_units 변환 → INSERT
```

### TM Export (TMX)

```
입력: TM Editor에서 "Export TMX" 클릭
과정:
  1. dialog.showSaveDialog({ filters: [{ name: 'TMX', extensions: ['tmx'] }] })
  2. translation_units 조회
  3. TMX XML 생성 (표준 TMX 1.4 형식)
출력: .tmx 파일 저장
```

### TM Settings

```
다이얼로그 항목:
  - Minimum match rate: 50% (기본), 슬라이더 0-100%
  - Good match threshold: 85% (기본)
  - Adjust fuzzy hits: 체크박스 (숫자/구두점/대소문자/태그 자동 조정)
  - Penalties: 정렬 세그먼트 자동 차감 % (기본 5%)

저장 위치: 프로젝트별 설정 (project_tms 테이블에 settings JSON 컬럼 추가 또는 별도 테이블)
```

## Acceptance Criteria

- [ ] TMX Import → TM에 엔트리 추가
- [ ] CSV Import → TM에 엔트리 추가
- [ ] TMX Export → 유효한 TMX 파일 생성
- [ ] TM Settings 다이얼로그 → 설정 저장/복원
- [ ] 대용량 Import 시 진행률 표시

## QA Checklist

- [ ] TMX Import → 엔트리 수 증가, TM Editor에서 확인
- [ ] CSV Import → 동일
- [ ] TMX Export → 파일 생성, 다른 CAT 도구에서 열 수 있는 형식
- [ ] TM Settings → 최소 매치율 변경 → 검색 결과에 반영

## Dependencies

- Sprint 5-4 완료 필수

## Out of Scope

- TM Repair
- Custom Fields Import/Export
