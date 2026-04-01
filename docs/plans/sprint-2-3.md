# Sprint 2-3: Details Pane + 상태 아이콘 + Clone/Delete

## Scope

Dashboard에 Details Pane(프로젝트 상세 정보 패널)을 추가하고, 프로젝트 상태 아이콘 7단계를 구현하며, Clone Project와 Delete 기능을 완성한다.

### 생성/수정할 파일

```
src/renderer/components/DetailsPaneProject.tsx  # Details Pane 컴포넌트
src/renderer/components/StatusIcon.tsx          # 상태 아이콘 컴포넌트 (7단계)
src/renderer/components/ConfirmDialog.tsx       # 범용 확인 다이얼로그
src/renderer/components/CloneProjectDialog.tsx  # Clone Project 다이얼로그
src/renderer/views/Dashboard.tsx                # (수정) Details Pane 통합, 삭제/복제 연결
src/renderer/components/grid/renderers/StatusRenderer.tsx # (수정) StatusIcon 사용
src/renderer/styles/details-pane.css            # Details Pane 스타일
src/renderer/styles/dialog.css                  # 다이얼로그 공통 스타일
src/shared/types/ipc.ts                         # (수정) clone, delete IPC 추가
src/main/ipc/projects.ts                        # (수정) clone, delete 핸들러
src/db/repositories/projects.ts                 # (수정) clone, delete 메서드
```

## Technical Prerequisites (Planner 확인)

- [x] Sprint 2-1의 Project CRUD API 사용
- [x] Sprint 2-2의 AG Grid 선택 이벤트로 Details Pane 연동

## 핵심 데이터 모델

기존 Project 타입 재사용. 추가 IPC 채널:

```typescript
PROJECT_CLONE:  'project:clone',   // { id, newName } → Project
PROJECT_DELETE: 'project:delete',  // { id } → void
```

## 주요 동작 흐름

### 1. Details Pane 표시

```
입력: AG Grid에서 프로젝트 행 클릭 (단일 선택)
출력: Dashboard 우측에 Details Pane 슬라이드 오픈
  - Project Data: Name, Description
  - Creation: Created by, Created at
  - Type: Source → Target 언어
  - Status: 상태 아이콘 + 텍스트
  - Deadline: 날짜 + 남은 일수
  - Client / Domain / Subject
  - 디렉토리 경로

입력: 선택 해제 또는 빈 영역 클릭
출력: Details Pane 닫힘
```

### 2. Clone Project

```
입력: 컨텍스트 메뉴 > Clone 또는 Details Pane > "Clone" 버튼
출력: Clone Project 다이얼로그
  - Name: 기본값 = 원본명 + " - clone"
  - "Clone" / "Cancel" 버튼

입력: 이름 입력 후 "Clone" 클릭
과정:
  1. project.clone({ id, newName }) 호출
  2. main: 원본 프로젝트 조회 → 새 UUID 생성
  3. main: 설정 복사 (name, directory 제외), 새 directory 생성
  4. main: INSERT → 새 Project 반환
출력: Dashboard 목록에 클론된 프로젝트 추가

검증:
  - 빈 이름 → "이름을 입력해주세요"
  - 중복 이름 → "이 이름의 프로젝트가 이미 존재합니다"
```

### 3. Delete Project

```
입력: 컨텍스트 메뉴 > Delete
출력: 확인 다이얼로그
  - "'{프로젝트명}' 프로젝트를 삭제하시겠습니까?"
  - "이 작업은 되돌릴 수 없습니다."
  - "Delete" (빨간색 버튼) / "Cancel"

입력: "Delete" 클릭
과정:
  1. project.delete({ id }) 호출
  2. main: 프로젝트 디렉토리 삭제 (fs.rmSync recursive)
  3. main: DELETE FROM projects → cascade → documents도 삭제
출력: Dashboard 목록에서 제거, Details Pane 닫힘
```

### 4. 상태 아이콘 7단계

```
| 상태 | 아이콘 | 색상 |
|------|--------|------|
| not-started | 빈 원 ○ | #9ca3af |
| in-progress | 반원 ◑ | #f59e0b |
| translation-done | 채운 원 ● | #3b82f6 |
| r1-done | 체크 원 ✓ | #22c55e |
| r2-done | 이중체크 ✓✓ | #16a34a |
| completed | 별 ★ | #16a34a |

아이콘 크기: 16x16px, SVG 인라인
```

## 시각적 스펙

### Details Pane

```
위치: Dashboard 우측, width: 320px
배경: var(--color-bg-primary)
테두리: left 1px solid var(--color-border-default)
패딩: var(--spacing-lg) (24px)
애니메이션: slide-in from right 200ms ease

섹션 구조:
  프로젝트 이름 (font-size: 18px, font-weight: 600, margin-bottom: var(--spacing-md))
  
  각 정보 행:
    라벨: font-size: var(--font-size-sm), color: var(--color-text-muted), margin-bottom: 2px
    값: font-size: var(--font-size-base), color: var(--color-text-primary), margin-bottom: var(--spacing-sm)
  
  구분선: 1px solid var(--color-border-default), margin: var(--spacing-md) 0
  
  하단 버튼:
    "Open" 버튼: primary 스타일 (accent 색상, width: 100%, height: 36px)
    "Clone" 버튼: secondary 스타일 (투명 배경, border)
    "Delete" 버튼: 텍스트만, color: #ef4444, hover underline
```

### ConfirmDialog / CloneProjectDialog

```
오버레이: rgba(0, 0, 0, 0.4)
다이얼로그: width: 400px, bg: var(--color-bg-primary), border-radius: 12px, padding: var(--spacing-xl)
  - 제목: font-size: 18px, font-weight: 600
  - 설명: font-size: var(--font-size-base), color: var(--color-text-secondary), margin: var(--spacing-md) 0
  - 버튼 영역: 우측 정렬, gap: var(--spacing-sm)
    Cancel: secondary 스타일
    Delete: bg #ef4444, color #ffffff, border-radius: 6px
    Clone: primary 스타일
```

## Acceptance Criteria

- [ ] 프로젝트 클릭 시 Details Pane 표시 (우측 패널)
- [ ] Details Pane에 프로젝트 정보 전체 표시
- [ ] 선택 해제 시 Details Pane 닫힘
- [ ] Clone → 다이얼로그 → 이름 입력 → 복제 성공
- [ ] Clone 중복 이름 에러 처리
- [ ] Delete → 확인 다이얼로그 → 삭제 성공, 디렉토리도 삭제
- [ ] 상태 아이콘 6종이 올바르게 렌더링
- [ ] ConfirmDialog가 오버레이+중앙 정렬로 표시

## QA Checklist

- [ ] 프로젝트 클릭 → Details Pane 슬라이드 오픈
- [ ] Details Pane 정보가 선택한 프로젝트와 일치
- [ ] 다른 프로젝트 클릭 → Details Pane 내용 갱신
- [ ] Clone → 기본 이름 "원본 - clone" → Clone 클릭 → 목록에 추가
- [ ] Delete → 확인 → 목록에서 제거, 디렉토리 삭제 확인
- [ ] Delete → Cancel → 삭제 안 됨

## Regression Checklist

- [ ] Sprint 2-2: AG Grid 정렬, 검색, 더블클릭
- [ ] Sprint 2-1: New Project Wizard
- [ ] Phase 1: E2E 테스트 전체 통과

## Known Gaps (memoQ 대비)

- memoQ의 Recycle Bin 기능 없음 — 삭제는 영구 삭제
- memoQ의 Back Up 기능은 제외
- Details Pane의 Progress 섹션은 Phase 4 이후 문서 데이터가 있어야 의미

## Dependencies

- Sprint 2-2 완료 필수 (AG Grid 프로젝트 목록)

## Out of Scope

- Project Home (Sprint 2-4)
- Project Settings (Sprint 2-4)
- 마감 알림 시스템 (Phase 13)
