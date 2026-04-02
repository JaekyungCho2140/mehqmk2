# mehQ Task Tracker

## Phase 1: Foundation (현재)

### Sprint 1-1: Electron Forge + Vite + React 보일러플레이트 ✅ QA PASS (15/15)
- [x] Electron Forge + Vite + React + TS 프로젝트 초기화
- [x] main/preload/renderer 3프로세스 구조 확립
- [x] BrowserWindow 설정 (1200x800, min 800x600)
- [x] CSS 변수 초기 정의 (:root)
- [x] `npm start` → 빈 창 + React 렌더링 확인
- [x] `npm run make` → 바이너리 빌드 확인
- [x] QA 검증 → docs/qa-reports/sprint-1-1-r1.md

### Sprint 1-2: SQLite + IPC 통신 레이어 ✅ QA PASS (17/17, R3)
- [x] better-sqlite3 설치 + Electron 네이티브 리빌드
- [x] DB 마이그레이션 시스템 구축
- [x] user_settings 스키마 (001-init)
- [x] Typed IPC 패턴 (settings:get/set, dialog:selectDirectory)
- [x] preload contextBridge API
- [x] QA 검증 → docs/qa-reports/sprint-1-2-r3.md

### Sprint 1-3: Welcome Wizard UI ✅ QA PASS (21/21)
- [x] 2단계 Wizard (이름 + 디렉토리), ui_language=ko 고정
- [x] QA 검증 → docs/qa-reports/sprint-1-3-r1.md

### Sprint 1-4: Playwright E2E + ESLint/Prettier ✅ QA PASS (E2E 7/7, Lint 0, Prettier 100%)
- [x] Playwright Electron E2E 인프라 + 7개 테스트 (4.5초)
- [x] ESLint + Prettier 설정
- [x] QA 검증 → docs/qa-reports/sprint-1-4-r1.md

---

## Phase 2: Project & Dashboard (현재)

### Sprint 2-1: DB 스키마 + Project CRUD + New Project Wizard ✅ QA PASS (19/19)
- [x] projects + documents DB 테이블, Project CRUD IPC, New Project Wizard
- [x] QA 검증 → docs/qa-reports/sprint-2-1-r1.md

### Sprint 2-2: Dashboard AG Grid 프로젝트 목록 ✅ QA PASS (18/18)
- [x] AG Grid + 셀 렌더러 4종, 정렬/검색, 더블클릭/우클릭
- [x] QA 검증 → docs/qa-reports/sprint-2-2-r1.md

### Sprint 2-3: Details Pane + 상태 아이콘 + Clone/Delete ✅ QA PASS
- [x] Details Pane, 상태 아이콘, Clone/Delete 다이얼로그
- [x] QA 검증 → docs/qa-reports/sprint-2-3-r1.md

### Sprint 2-4: Project Home 셸 + Project Settings ✅ QA PASS
- [x] Project Home 3탭, Settings 편집, AppView 상태 관리, Breadcrumb
- [x] QA 검증 → docs/qa-reports/sprint-2-4-r1.md

### Sprint 2-5: E2E 프로젝트 CRUD 전체 플로우 ✅ QA PASS (E2E 23/23)
- [x] E2E 23개 전체 통과 (Phase 1 + Phase 2)
- [x] QA 검증 → docs/qa-reports/sprint-2-5-r1.md

---

## Phase 3: Editor Core (현재) ⚠️ 최대 리스크

> 아키텍처 결정: 셀 외부 편집 패널 (memoQ 패턴) 채택. TipTap v3.22.0 사용.

### Sprint 3-1: AG Grid 세그먼트 그리드 + 편집 패널 셸 ✅ QA PASS (Design 5/5)
- [x] 세그먼트 그리드 4열, EditPanel, 샘플 20개
- [x] QA 검증 → docs/qa-reports/sprint-3-1-r1.md

### Sprint 3-2: TipTap 편집 패널 통합 ✅ QA PASS (R2)
- [x] TipTap 에디터, 세그먼트 전환, Grid 동기화
- [x] QA 검증 → docs/qa-reports/sprint-3-2-r2.md

### Sprint 3-3: 키보드 네비게이션 ✅ QA PASS
- [x] Arrow/Tab/Ctrl+Home/End/PageUp/Down, 멀티 선택
- [x] QA 검증 → docs/qa-reports/sprint-3-3-r1.md

### Sprint 3-4: 번역 확인 로직 ✅ QA PASS
- [x] Ctrl+Enter 확인+다음, Ctrl+Shift+Enter, 자동 저장
- [x] QA 검증 → docs/qa-reports/sprint-3-4-r1.md

### Sprint 3-5: 서식 + 텍스트 조작 ✅ QA PASS
- [x] B/I/U 서식 툴바, Source→Target 복사, 대소문자 변경
- [x] QA 검증 → docs/qa-reports/sprint-3-5-r1.md

### Sprint 3-6: Status Bar + 필터링/정렬 ✅ QA PASS
- [x] StatusBar + FilterBar + 정렬
- [x] QA 검증 → docs/qa-reports/sprint-3-6-r1.md

### Sprint 3-7: 세그먼트 상태 시스템 ✅ QA PASS
- [x] 9종 상태 + Change Status 다이얼로그 + 잠금/해제
- [x] QA 검증 → docs/qa-reports/sprint-3-7-r1.md

### Sprint 3-8: E2E 에디터 테스트 ✅ QA PASS (R3, 46/47 + 1 flaky)
- [x] E2E 47개 (46 pass, 1 known flaky)
- [x] QA 검증 → docs/qa-reports/sprint-3-8-r3.md

---

## Phase 4: Document Import & Bilingual (현재) — 최소 CAT 완성 마일스톤

### Sprint 4-1: XLIFF 파서 + segments DB ✅ QA PASS (R2)
- [x] XLIFF 1.2 + 2.0 파서, segments 테이블, DB 세그먼트 로드
- [x] QA 검증 → docs/qa-reports/sprint-4-1-r2.md

### Sprint 4-2: PO/TMX/mehQ XLIFF 파서 ✅ QA PASS
- [x] PO + TMX + 파서 레지스트리
- [x] QA 검증 → docs/qa-reports/sprint-4-2-r1.md

### Sprint 4-3: Wizard Documents 단계 ✅ QA PASS
- [x] FileDropZone, Import, 확장자 자동 감지
- [x] QA 검증 → docs/qa-reports/sprint-4-3-r1.md

### Sprint 4-4: Export (XLIFF/PO) ✅ QA PASS
- [x] XLIFF/PO Export, 상태 반영, round-trip 무손실
- [x] QA 검증 → docs/qa-reports/sprint-4-4-r1.md

### Sprint 4-5: Import Settings ✅ QA PASS
- [x] Filter Configurations UI, 수동 오버라이드
- [x] QA 검증 → docs/qa-reports/sprint-4-5-r1.md

### Sprint 4-6: E2E Round-trip ✅ QA PASS (R3, 58/59 + 1 flaky)
- [x] E2E 59개 (58 pass, 1 known flaky)
- [x] QA 검증 → docs/qa-reports/sprint-4-6-r3.md

> 🎯 **최소 CAT 도구 완성**: XLIFF/PO Import → 번역 편집 → 확인 → Export

---

## Phase 5: Translation Memory (현재)

### Sprint 5-1: TM DB 스키마 + CRUD + 생성 다이얼로그 ✅ QA PASS (E2E 65)
- [x] TM DB, CRUD, 생성 다이얼로그, Wizard Step 3
- [x] QA 검증

### Sprint 5-2: TM Match Scoring 엔진 ✅ QA PASS (E2E 72)
- [x] Levenshtein, Context match, Number Substitution
- [x] QA 검증

### Sprint 5-3: TM 에디터 연동 ✅ QA PASS (E2E 77)
- [x] Ctrl+Enter→TM 저장, 이동→TM 조회, 매치 삽입
- [x] QA 검증

### Sprint 5-4: TM Editor ✅ QA PASS (E2E 85)
- [x] AG Grid 편집, Find&Replace, Flagging
- [x] QA 검증

### Sprint 5-5: TM Import/Export + Settings ✅ QA PASS (E2E 89)
- [x] TMX/CSV Import, TMX Export, TM Settings
- [x] QA 검증

### Sprint 5-6: E2E TM 통합 테스트 ✅ QA PASS (E2E 90, 89 pass + 1 flaky)
- [x] 12개 시나리오 전체 커버, Phase 5 신규 31개
- [x] QA 검증

---

## Phase 6: Results & Lookup (다음)
- Translation Results Pane, AutoPick, Concordance
- 상세 계획은 Phase 5 완료 후 작성
