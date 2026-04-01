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

### Sprint 1-2: SQLite + IPC 통신 레이어
- [ ] better-sqlite3 설치 + Electron 네이티브 리빌드
- [ ] DB 마이그레이션 시스템 구축
- [ ] user_settings 스키마 (001-init)
- [ ] Typed IPC 패턴 (settings:get/set, dialog:selectDirectory)
- [ ] preload contextBridge API
- [ ] QA 검증

### Sprint 1-3: Welcome Wizard UI
- [ ] App.tsx 라우팅 (wizard_completed 분기)
- [ ] Step 1: 사용자 이름 입력 (검증 포함)
- [ ] Step 2: 작업 디렉토리 선택 (Browse 다이얼로그)
- [ ] Step 3: UI 언어 선택 (4개 옵션)
- [ ] Finish → settings 저장 → Dashboard 전환
- [ ] 빈 Dashboard 셸
- [ ] QA 검증

### Sprint 1-4: Playwright E2E + ESLint/Prettier
- [ ] Playwright Electron E2E 인프라 (launch/close 헬퍼, DB 격리)
- [ ] E2E 테스트 7개 (앱 시작, Wizard 플로우, 설정 영속성)
- [ ] ESLint + Prettier 설정
- [ ] data-testid 전 컴포넌트 부여
- [ ] 전체 lint/format 통과
- [ ] QA 검증

---

## Phase 2: Project & Dashboard (다음)
- 프로젝트 CRUD, Dashboard AG Grid 목록, Project Home 셸
- 상세 계획은 Phase 1 완료 후 작성
