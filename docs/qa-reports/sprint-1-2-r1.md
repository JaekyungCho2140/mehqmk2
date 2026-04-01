# Sprint 1-2 QA Report - Round 1

## Summary
- Total: 6 QA checklist + 3 regression + 8 acceptance criteria
- Passed: 0 (테스트 불가)
- Failed: 1 (CRITICAL - 앱 시작 불가)
- Skipped: 16 (앱 미실행으로 인해)

## Quality Assessment
### Design Quality: N/A — 앱이 실행되지 않아 평가 불가
### Originality: N/A
### Craft: 4/5 — 코드 구조, 타입 안전성, 마이그레이션 시스템 등 설계 우수
### Functionality: 1/5 — `electron-forge start`에서 앱이 즉시 종료됨

## CRITICAL Bug: `electron-forge start`에서 앱 즉시 종료

### 증상
- `npm start` (= `electron-forge start`) 실행 시 Vite dev server + main 빌드는 성공하지만, Electron 앱이 즉시 종료 (exit code 0)
- 사용자에게 창이 전혀 보이지 않음
- `mehq.db`가 생성되지 않음 → `app.on('ready')` 콜백이 실행되기 전에 종료

### 재현 방법
```bash
npm start    # 앱이 시작 직후 즉시 종료됨
```

### 비교 검증 (동일 코드, 다른 실행 방법)
| 실행 방법 | 결과 | DB 생성 | 창 표시 |
|-----------|------|---------|---------|
| `npm start` (electron-forge start) | 즉시 종료 (exit 0) | ❌ | ❌ |
| `npx electron .` (직접 실행) | 정상 동작 | ✅ mehQ/ | ✅ (localhost 미연결 에러) |
| `npx electron .vite/build/main.js` (직접 실행) | 정상 동작 | ✅ Electron/ | ✅ |

### Root Cause 후보
1. **Sprint 1-1 → 1-2 과정에서 Forge 설정 변경**: `forge.config.ts`에 `packageAfterPrune` 훅 추가, `vite.main.config.ts`에 external 추가 — 이들이 dev 모드 시작 흐름에 영향?
2. **better-sqlite3 native 모듈**: Forge의 `Preparing native dependencies` 단계에서 ABI 불일치 감지 후 앱을 종료?
3. **electron-squirrel-startup**: 빌드된 코드에서 `process.platform === 'win32'` 조건 안에 있으므로 macOS에서 무관
4. **Forge Vite 플러그인 버그**: main.js 빌드 시 모듈 해결 경로가 달라져서 런타임 에러 발생 가능

### 디버그 시도
- `tsc --noEmit` 3프로세스 통과 ✅
- `electron-rebuild -f -w better-sqlite3` 실행 후 재시도 → 동일 증상
- `.vite/build/main.js` 코드 검토: `require("better-sqlite3")` 정상 포함, try-catch로 에러 핸들링됨
- Forge 출력에 에러 메시지 없음 (main process console이 Forge에 의해 캡처되지 않음)

### Suggested Fix
1. `electron-forge start` 실행 시 main 프로세스 stdout/stderr를 터미널에 출력하도록 확인
2. 임시로 `src/main/index.ts` 최상단에 `require('fs').writeFileSync('/tmp/mehq-debug.log', 'started')` 추가하여 main 진입 여부 확인
3. better-sqlite3 import를 주석 처리하고 실행하여 네이티브 모듈이 원인인지 격리
4. Sprint 1-1 상태로 롤백 후 `npm start`가 정상 동작하는지 확인 → 차이 비교

## TypeScript Check
- `tsc --noEmit` main ✅, preload ✅, renderer ✅

## Code Review (참고)
코드 자체는 Sprint spec과 정확히 일치:
- database.ts: lazy-load 싱글턴, WAL 모드, foreign keys ✅
- migrations/index.ts: 트랜잭션 기반 마이그레이션 ✅
- repositories/settings.ts: getAll, get, set, setBulk + 기본값 resolve ✅
- ipc/settings.ts: 5개 채널 핸들러 등록 ✅
- preload/index.ts: contextBridge API (electronAPI.settings.*, dialog.*) ✅
- shared/types: Typed IPC 채널 + UserSettings ✅

## Verdict: qa-fail

**CRITICAL**: `electron-forge start`에서 앱이 즉시 종료되어 기능 검증 불가. Generator가 Forge dev 모드 실행 문제를 해결한 후 재검증 필요.
