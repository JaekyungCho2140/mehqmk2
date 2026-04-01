# Sprint 2-1 QA Report - Round 1

## Summary
- Total: 7 QA checklist + 3 regression + 9 acceptance criteria
- Passed: 19
- Failed: 0
- Skipped: 0

## Quality Assessment
### Design Quality: 4/5 — New Project Wizard 폼 레이아웃이 깔끔하고 전문적. 필수 필드(*) 표시, 구분선으로 필수/선택 필드 구분. LanguageSelect 드롭다운 검색 기능 우수.
### Originality: 4/5 — memoQ 스타일의 프로젝트 생성 흐름을 잘 재현. Source/Target 중복 방지 로직이 드롭다운에 자연스럽게 통합됨.
### Craft: 4/5 — CSS 변수 사용, 에러 메시지 스타일링, 폼 레이아웃 일관성 양호.
### Functionality: 5/5 — CRUD, 중복 검사, Cancel, 영속성 모두 완벽 동작.

## QA Checklist (computer-use로 직접 검증)
- [x] "+ New Project" → Wizard 표시 (Name, Source/Target Lang, Client/Domain/Subject/Description, Finish)
- [x] 필수 필드 미입력 시 Finish 비활성 또는 에러
- [x] 정상 입력 후 Finish → 프로젝트 생성 ("Test Project Alpha"), Dashboard 목록에 "en → ko | not-started" 표시
- [x] 중복 이름 → "이 이름의 프로젝트가 이미 존재합니다" 에러 메시지 (빨간색)
- [x] Cancel → Dashboard 복귀, 중복 프로젝트 미생성 (1개 유지)
- [x] 프로젝트 디렉토리 생성 확인: `/Users/jaekyungcho/Documents/mehQ/Test Project Alpha/` 존재
- [x] 앱 재시작 후 프로젝트 목록 유지 (DB 영속)

## Regression Checklist
- [x] Phase 1: E2E 7/7 PASS
- [x] Phase 1: Welcome Wizard 정상 동작 (최초 실행 시)
- [x] Phase 1: 설정 저장/복원

## Acceptance Criteria
- [x] DB에 projects, documents 테이블 존재
- [x] Dashboard에서 "+ New Project" → New Project Wizard 표시
- [x] Name, Source/Target Language 입력 후 Finish → 프로젝트 생성, Dashboard 복귀
- [x] 생성된 프로젝트가 Dashboard 목록에 표시
- [x] 중복 이름 → 에러 메시지
- [x] Source = Target 방지 (Target 드롭다운에서 Source 언어 제외)
- [x] Cancel → Dashboard 복귀, 프로젝트 미생성
- [x] 프로젝트 디렉토리가 파일시스템에 생성됨
- [x] TypeScript 컴파일 에러 없음

## Build & Automation
- `tsc --noEmit`: 3프로세스 통과 ✅
- `npm run test:e2e`: 7/7 PASS ✅
- `npm run lint`: 에러 0 ✅
- `npm run format:check`: 100% ✅
- `npx electron-forge package`: 성공 ✅

## DB 확인
```sql
SELECT name, source_lang, target_lang, status, directory FROM projects;
-- Test Project Alpha|en|ko|not-started|/Users/jaekyungcho/Documents/mehQ/Test Project Alpha
```

## 추가 확인 사항
- LanguageSelect 검색 기능: 드롭다운 상단 "검색..." 필터 동작 확인
- Target Language에서 Source와 동일 언어 자동 제외 확인
- Wizard 2단계 (언어 선택 Step 제거) 반영 확인

## Verdict: qa-pass
