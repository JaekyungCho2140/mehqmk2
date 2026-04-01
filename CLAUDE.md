# mehQ - Computer-Assisted Translation Tool

memoQ의 UI/UX를 참고한 로컬 전용 CAT 도구. 구현 범위는 `docs/specs/mehq-feature-spec.md`에서 선별된 기능만 포함하며, MT(Machine Translation)와 서버/온라인 기능은 제외.

## Tech Stack
- **Platform**: Electron + React + TypeScript
- **Grid**: AG Grid Community
- **Editor**: ProseMirror (TipTap)
- **DB**: SQLite (better-sqlite3)
- **QA**: Playwright (Electron)
- **File Parsing**: Python sidecar (Phase 10+)

## Commands
- `npm start` — 개발 모드 실행
- `npm run make` — 플랫폼 바이너리 빌드
- `npm run test:e2e` — Playwright E2E 테스트
- `npm run lint` — ESLint
- `npm run format` — Prettier

## 4-Agent Collaboration Protocol

이 프로젝트는 4개의 Claude Code 인스턴스가 claude-peers MCP로 통신하며 병렬 작업합니다.

### Roles

| Role | Summary | File Ownership (Write) | Read Only | 상세 지시 |
|------|---------|----------------------|-----------|----------|
| **Watcher** | 15분 간격 모니터링, idle 감지, 작업 재개 요청 | 없음 | 전체 | `docs/roles/watcher.md` |
| **Planner** | 요구사항 분석, 스펙 작성, Sprint Contract 정의 | `docs/specs/*`, `docs/plans/*` | 전체 | `docs/roles/planner.md` |
| **Generator** | 코드 구현, 빌드 설정, 의존성 관리 | `src/*`, `package.json`, `*.config.*`, `docs/impl/*` | `docs/specs/*`, `docs/qa-reports/*` | `docs/roles/generator.md` |
| **QA** | 테스트 작성/실행, 버그 리포트, 품질 게이트 | `tests/*`, `docs/qa-reports/*`, `playwright.config.ts` | 전체 (수정 금지: `src/*`) | `docs/roles/qa.md` |

### Starting Your Role

세션 시작 시:
1. 사용자가 "너는 [Watcher|Planner|Generator|QA]야"로 역할을 지정
2. **즉시 `docs/roles/{역할명}.md`를 Read 도구로 읽는다** — 이 파일이 해당 역할의 모든 규칙, 금지사항, 절차를 정의한다. 역할 파일을 읽기 전에는 어떤 작업도 시작하지 않는다.
3. 역할 파일의 "Session Start" 절차를 순서대로 실행한다
4. `tasks/todo.md`와 `git log --oneline -10`으로 현재 진행 상태를 파악한다

### Communication Protocol (via claude-peers)

메시지 포맷:
```
[Role][action] message
```

#### Flow
1. **Planner** → Generator: `[Planner][spec-ready] Sprint Contract 준비됨. docs/plans/sprint-1a.md 참고`
2. **Generator** → QA: `[Generator][impl-done] 구현 완료. npm run build 후 테스트`
3. **QA** → Generator: `[QA][qa-fail] 실패. docs/qa-reports/sprint-1a-r1.md 참고`
4. **Generator** → QA: `[Generator][fix-done] 수정 완료. 재테스트 요청`
5. **QA** → Planner: `[QA][qa-pass] 모든 기준 통과`
6. **Planner** → Generator: `[Planner][spec-ready] 다음 Sprint 준비`
7. **Watcher** → All: `[Watcher][status-check]` / `[Watcher][resume-request]` / `[Watcher][nudge]`

### Rules
1. 각 에이전트는 자신의 File Ownership 내에서만 파일을 수정한다
2. `CLAUDE.md`, `tasks/todo.md`, `tasks/lessons.md`는 4명 모두 수정 가능 (append-only)
3. Generator만 `git commit` 권한을 가진다
4. QA는 `src/` 파일을 절대 수정하지 않는다 — 버그를 발견하면 리포트만 작성
5. Watcher는 코드를 수정하지 않는다 — 모니터링과 메시지 전달만 수행
6. 최대 5회 QA 반복 후에도 실패하면 Planner에게 에스컬레이션
7. 검증되지 않은 기술(API, 패턴)을 다른 에이전트에게 지시하지 않는다 — package.json 버전과 node_modules에서 확인 후 전달
8. 다른 에이전트의 "불가능" 응답을 검증 없이 수용하지 않는다 — 직접 확인 후 판단 근거와 함께 응답
9. 모호한 지시 금지: 색상은 hex, 크기는 px, 동작은 입력→출력 쌍으로 기술

## Project Structure

현재 구조 (개발 전). `src/`, `tests/`는 Phase 1에서 생성 예정.

```
docs/
├── roles/         # 역할별 상세 지시 (watcher.md, planner.md, generator.md, qa.md)
├── specs/         # 기능 명세 + memoQ 연구 자료
│   ├── mehq-feature-spec.md          # 확정된 구현 기능 명세 (SSoT)
│   └── memoq-*-research.md           # memoQ 공식 문서 크롤링 연구 자료 (5개)
├── plans/         # 로드맵 + Sprint 계획
│   └── roadmap.md                    # 14 Phase 구현 로드맵
├── impl/          # Generator: implementation notes (Phase 1+)
└── qa-reports/    # QA: test reports (Phase 1+)
tasks/
├── todo.md        # Shared task tracking
└── lessons.md     # Lessons learned
```

Phase 1 이후 생성될 구조:
```
src/
├── main/          # Electron main process
├── preload/       # Preload scripts
├── renderer/      # React app
├── shared/types/  # Shared TypeScript types
└── db/            # SQLite layer
tests/
├── e2e/           # Playwright E2E tests
├── unit/          # Unit tests
└── fixtures/      # Test data (sample.xliff, sample.tmx, etc.)
```
